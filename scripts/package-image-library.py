"""Package only selected assets, their provenance, and the offline image book."""
import hashlib
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'outputs/nobase-image-library-2026-11-04.zip'
TARGET.parent.mkdir(exist_ok=True)

files = list((ROOT / 'public/image-library').rglob('*'))
files += list((ROOT / 'source-assets/library/generated').glob('*.png'))
files += list((ROOT / 'source-assets/library/originals').glob('*.png'))
files += list((ROOT / 'research').glob('*.json'))
files += [ROOT / 'research/report-fragment.html', ROOT / 'source-assets/library/README.txt']
files += [ROOT / 'scripts/build-image-library.py', ROOT / 'scripts/package-image-library.py']
generation = json.loads((ROOT / 'research/generation-prompts.json').read_text())
files += [ROOT / generation['reference']]
stock = json.loads((ROOT / 'research/stock-sources.json').read_text())
files += [ROOT / p['sourcePath'] for p in stock['photos'] if p['selected']]
files = sorted({p for p in files if p.is_file()})

start = '<!doctype html><html lang="ko"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=public/image-library/index.html"><title>노베이스 이미지북</title><a href="public/image-library/index.html">노베이스 이미지북 열기</a></html>'
checksums = []
with ZipFile(TARGET, 'w', ZIP_DEFLATED, compresslevel=6) as archive:
    for file in files:
        name = file.relative_to(ROOT).as_posix()
        archive.write(file, name)
        checksums.append(hashlib.sha256(file.read_bytes()).hexdigest() + '  ' + name)
    archive.writestr('이미지북.html', start)
    archive.writestr('README.txt', (ROOT / 'source-assets/library/README.txt').read_bytes())
    archive.writestr('CHECKSUMS.sha256', '\n'.join(checksums)+'\n')

with ZipFile(TARGET) as archive:
    assert archive.testzip() is None, 'Archive integrity check failed'
    names = archive.namelist()
    assert not any('rejected' in p or 'library/extracted/' in p for p in names)
    assert len([p for p in names if p.startswith('source-assets/library/stock/')]) == 3
    assert len([p for p in names if p.startswith('source-assets/library/generated/')]) == 4
print(json.dumps({'path':str(TARGET),'bytes':TARGET.stat().st_size,'files':len(names),'integrity':'passed'},ensure_ascii=False))
