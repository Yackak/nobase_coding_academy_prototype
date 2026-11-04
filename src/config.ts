interface AcademyConfig {
  academyName: string;
  demoMode: boolean;
  kakaoUrl: string | null;
  phone: string | null;
  address: string;
  roadAddress: string;
  mapUrl: string;
  consultationHours: string | null;
  subjects: string;
  schedule: string;
  tuition: string;
}

// Keep contact values here. The phone number is used for actions, never visible text.
export const config: Readonly<AcademyConfig> = Object.freeze({
  academyName: '노베이스 학원', demoMode: false, kakaoUrl: null,
  phone: '010-2438-0080',
  address: '전라북도 정읍시 상동 74-1 2층',
  roadAddress: '전북특별자치도 정읍시 학산로 103-18, 2층',
  mapUrl: 'https://naver.me/5bClL0tf', consultationHours: null,
  subjects: '영어 · 수학 | 초등 고학년 · 중고 내신 집중관리',
  schedule: '학생의 학년과 학습 상황에 맞는 수업 일정·운영 방식은 상담 시 안내합니다.',
  tuition: '과정별 수강료와 교재비 등 세부 비용은 상담 시 안내합니다.',
});
