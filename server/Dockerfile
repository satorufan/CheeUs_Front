# Node.js 20을 사용하는 기본 이미지
FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 종속성 설치
COPY server/package.json server/package-lock.json ./
RUN npm install --force

# PM2 설치
RUN npm install -g pm2

# 애플리케이션 파일 복사
COPY server/ .

# PM2를 사용하여 애플리케이션 실행
CMD ["pm2-runtime", "ecosystem.config.js"]
