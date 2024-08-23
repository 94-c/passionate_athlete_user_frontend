# Base image 설정
FROM node:14-alpine as build

# 환경 변수 설정
ENV NODE_ENV=production

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일만 복사하고 npm install 수행
COPY package*.json ./

# package-lock.json을 이용하여 의존성 설치 (더 안전한 방법)
RUN npm ci --silent

# 호스트 머신의 현재 디렉토리 파일들을 컨테이너 내부로 전부 복사
COPY . .

# 빌드
RUN npm run build

# Production 환경 설정
FROM nginx:stable-alpine

# 이전 빌드 단계에서 빌드한 결과물을 Nginx 경로로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 기본 nginx 설정 파일 삭제 및 custom 설정 복사
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# 80번 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
