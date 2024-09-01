# base image 설정
FROM node:14-alpine as build

# 빌드 인자 설정
ARG REACT_APP_API_BASE_URL

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 파일을 컨테이너 내부로 복사
COPY package*.json ./

# 의존성 패키지 설치
RUN npm install

# 모든 소스 코드를 컨테이너 내부로 복사
COPY . .

# 환경 변수 설정
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# 빌드 수행
RUN npm run build

# nginx 설정을 위한 production 이미지 설정
FROM nginx:stable-alpine

# 빌드된 결과물을 Nginx 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 기본 Nginx 설정 파일 삭제
RUN rm /etc/nginx/conf.d/default.conf

# 사용자 정의 Nginx 설정 파일 복사
COPY nginx/nginx.conf /etc/nginx/conf.d

# Nginx 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
