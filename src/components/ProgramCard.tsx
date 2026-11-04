import CourseScene from './CourseScene';
import ResponsiveDetails from './ResponsiveDetails';
import { useContact } from './ContactProvider';

type Program = { level: 'elementary' | 'middle' | 'high'; step: string; english: string; tag: string; title: string; description: string; items: string[]; interest: string };
export const programs: Program[] = [
  { level: 'elementary', step: '01', english: 'ELEMENTARY', tag: '초등 고학년 · 영어 · 수학', title: '기초를 단단하게', description: '영어와 수학의 기본기를 쌓고, 중등 학습으로 이어질 힘을 기릅니다.', items: ['영어 어휘 · 문장 읽기 · 기초 문법', '수학 교과 개념 · 연산 · 문제 이해', '복습과 과제로 학습 습관 만들기'], interest: '초등 고학년' },
  { level: 'middle', step: '02', english: 'MIDDLE SCHOOL', tag: '중등 · 영어 · 수학', title: '내신의 흐름 잡기', description: '학교 수업의 개념을 이해하고, 시험 범위에 맞춰 꼼꼼히 복습합니다.', items: ['영어 교과 문법 · 독해 · 서술형', '수학 단원별 개념과 유형 학습', '시험 범위 점검 · 오답 복습'], interest: '중등 내신' },
  { level: 'high', step: '03', english: 'HIGH SCHOOL', tag: '고등 · 영어 · 수학', title: '약점을 실력으로', description: '학교별 학습 범위를 바탕으로, 취약한 부분을 채우는 내신 집중관리.', items: ['영어 지문 분석 · 문법 · 서술형', '수학 개념 적용 · 풀이 과정 점검', '취약 유형 복습 · 내신 대비'], interest: '고등 내신' },
];
export default function ProgramCard({ program }: { program: Program }) {
  const { contact } = useContact();
  return <article className="program-card">
    <div className="program-meta"><span>STEP {program.step}</span><span>{program.english}</span></div>
    <span className="program-tag">{program.tag}</span><h3>{program.title}</h3><p>{program.description}</p>
    <ResponsiveDetails className="program-details" desktopOpen>
      <summary><span>과정 상세 보기</span><span className="detail-plus" aria-hidden="true" /></summary>
      <div className="program-detail-body"><CourseScene level={program.level} /><ul>{program.items.map(item => <li key={item}>{item}</li>)}</ul>
        <button className="program-link" onClick={() => contact('kakao', program.interest)}>이 과정 상담하기<svg aria-hidden="true"><use href="#i-diagonal" /></svg></button>
      </div>
    </ResponsiveDetails>
  </article>;
}
