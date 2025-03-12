# Hpost Backend

## 프로젝트 소개

NestJS 기반의 백엔드 프로젝트입니다.

## 시작하기

### 사전 요구사항

- Node.js
- pnpm
- NestJS CLI

### 설치

```bash
pnpm install
```

## 실행 방법

### 개발 환경

```bash
# Core API 개발 서버 실행
pnpm run start:core-api:dev
```

### 프로덕션 환경

```bash
# 빌드
pnpm run build

# Core API 프로덕션 실행
pnpm run start:core-api:prod
```

## 테스트

### 단위 테스트

```bash
# 전체 테스트 실행
pnpm run test

# 테스트 감시 모드
pnpm run test:watch
```

### E2E 테스트

```bash
# Core API E2E 테스트
pnpm run test:core-api:e2e
```

## 프로젝트 구조

```
project/
├── apps/
│   └── core-api/     # Core API 애플리케이션
├── libs/
│   ├── core/         # 코어 라이브러리
│   ├── storage/      # 스토리지 라이브러리
│   └── support/      # 지원 라이브러리
```

## Convention

- 객체를 초기화할 때는 new 연산자로 생성하지 않는다. 객체는 인스턴스를 생성하는 static 메서드를 제공해야 한다.
- API에서 데이터를 생성 또는 수정 시 해당 데이터의 id를 반환한다.
- controller 레이어에서는 Request 객체로 데이터를 전달하고, 필요 시 Response 객체로 응답한다.
- controller(Presentation)을 제외한 레이어에서는 의미있는 Domain 객체를 사용하여 데이터를 주고 받아야 한다.
- Pagination을 필요로 하는 데이터는 Pagination 객체로 관련 정보를 받고, PaginationResult 객체로 응답한다.
- 도메인 객체는 매개변수의 개수가 3개 이상일 때는 RORO 패턴을 적용한다.
- Controller, Usecase, Implements, Repository 등 아키텍쳐를 담당하는 클래스들은 매개변수에 따른 RORO 패턴 적용 룰을 반드시 지키지 않아도 된다.
- Usecase, Implements 레이어에서는 Service Exception으로 예외를 처리한다.
- Controller 레이어에서는 NestJS가 제공하는 HttpException을 사용하고 HttpException을 처리하는 필터를 추가한다.
- NestJs는 @Post 데코레이터를 사용하면 기본적으로 HttpStatus Code를 201로 응답한다. Post 사용 시 리소스를 생성하지 않는 경우에는 @HttpCode 데코레이터를 사용하여 HttpStatus Code를 200으로 변경한다. (예시: login API 참고)
- class-validator를 이용한 유효성 검사는 type에 맞는 값인지의 여부, 필수적으로 필요한 값들이 전달되었는지 검사하고, 정책적인 유효성 검사는 별도의 로직을 이용해 처리한다.
  - ex) 회원 가입 시 email 필드에 전달된 값이 null, undefined, 빈 문자열인지 검사하는 경우 class-validator를 사용한다. 해당 이메일이 적합한 형식인지는 별도의 비지니스 로직을 이용해 검사한다.

## API 문서

[Apidog](https://3xxfyj1gi8.apidog.io/)

