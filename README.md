# Anonymous Board

## Description

댓글 작성 기능과 키워드 알람 기능이 있는 익명 게시판 Backend Repository

## Url
### Server
http://localhost:3333/v1
### Swagger Docs
http://localhost:3333/api

## Project setup (local)
### DB setup
1. 로컬 환경에 mysql 설치 후 `root` 계정으로 접속
2. 계정 생성 및 권한 부여
```sql
CREATE USER 'daseul'@'localhost' IDENTIFIED BY 'daseul0417';
CREATE USER 'daseul'@'%' IDENTIFIED BY 'daseul0417';

GRANT ALL ON *.* TO 'daseul'@'localhost';
GRANT ALL ON *.* TO 'daseul'@'%';

FLUSH PRIVILEGES;
```
3. mysql service 재시작
4. `daseul` 계정으로 mysql 접속
5. `anonymous_board` database 생성 및 접속
```sql
CREATE DATABASE anonymous_board;

USE anonymous_board;
```
6. `.sql/schema.sql` 파일 내 쿼리를 실행하여 테이블 생성
7. (선택 사항) `.sql/mock-data.sql` 파일 내 쿼리를 실행하여 `authors`, `keywords` 테이블에 더미 데이터 삽입

### Server setup
```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
