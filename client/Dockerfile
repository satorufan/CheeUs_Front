# Node.js 20을 사용하는 기본 이미지
FROM node:20 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install --force

# 애플리케이션 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# Nginx를 사용하는 다음 단계
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드 결과물을 Nginx 웹 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx의 기본 포트인 80을 노출
EXPOSE 80

# Nginx 실행 명령
CMD ["nginx", "-g", "daemon off;"]
