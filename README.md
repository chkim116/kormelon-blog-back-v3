# kormelon-blog-v3

kormelon-blog-v3

## Quick Start

- Development

1. .env.development의 적절한 설정
2. 해당 커맨드 실행

```shell
npm install && npm run dev
```

- Production

1. .env.production의 적절한 설정
2. 해당 커맨드 실행

```shell
npm install && npm run start
```

### Folder Structure

현 프로젝트에서 채택한 폴더 구조의 핵심은 다음과 같습니다.

[bulletproof-nodejs](https://github.com/santiq/bulletproof-nodejs/tree/master/src)의 폴더 구조를 참조하였습니다.

```
📦src
 ┣ 📂api
 ┣ 📂config
 ┣ 📂loaders
 ┣ 📂models
 ┣ 📂services
```

1. api

서버에서 유저와 상호작용을 담당하는 폴더입니다.

하위 폴더에는 `controller`, `middlewares`, `routes`가 있습니다.

2. config

서버에서 사용하는 환경 변수에 대한 세팅 폴더입니다.

3. loaders

서버에서 사용할 기능들이 세팅되어 있는 폴더입니다.

실질적인 엔드포인트는 루트 디렉토리의 `app.ts`이나, express 세팅과 typeorm 세팅은 이곳에 있습니다.

4. models

서버에서 사용할 엔티티 폴더입니다.

5. services

models 폴더와 api 폴더를 잇는 중간 레이어입니다.

서버는 DB에 접근해 어떤 행동을 하기 위해 항상 services를 거칩니다.

내부적에서 typeorm의 repository를 사용합니다.

## TODO LIST

- [ ] 액세스, 리프레쉬 토큰
- [ ] 유저 프로필 수정 기능

--

- [ ] 시스템 로깅 및 매일 알림 (메일 or 슬랙)
- [ ] 다이어그램 작성
- [ ] 스웨거 작성
