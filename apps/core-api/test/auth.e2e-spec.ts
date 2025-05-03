import { setNestApp } from '@core-api/config/set-nest-app';
import { CoreApiModule } from '@core-api/core-api.module';
import { UserRepository } from '@core/auth/repository/user.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryStorageModule } from '@storage/memory/memory.module';
import request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authUserRepository: UserRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreApiModule, MemoryStorageModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setNestApp(app);
    await app.init();

    authUserRepository = moduleFixture.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await authUserRepository.deleteAll();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/auth/signup (POST)', () => {
    it('성공', async () => {
      // given
      const signupBody = {
        name: '테스트 사용자',
        email: 'test@example.com',
        phoneNumber: '01012345678',
        password: 'Password123',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signupBody);

      // then
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        code: 'SUCCESS',
        errors: [],
        message: 'AuthUser created successfully',
        data: {
          id: expect.any(String),
        },
      });
    });

    it('이미 존재하는 이메일', async () => {
      // given
      const signupBody = {
        name: '테스트 사용자',
        email: 'duplicate@example.com',
        phoneNumber: '01012345678',
        password: 'Password123!',
      };

      // 회원가입 API를 통해 사용자 생성
      await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signupBody);

      // when - 동일한 이메일로 다시 회원가입 시도
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signupBody);

      // then
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('DUPLICATE_ENTITY');
    });

    it('유효하지 않은 이메일 형식', async () => {
      // given
      const signupBody = {
        name: '테스트 사용자',
        email: 'invalid-email',
        phoneNumber: '01012345678',
        password: 'Password123',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signupBody);

      // then
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('BAD_REQUEST');
      expect(response.body.message).toBe('올바른 이메일 형식이 아닙니다.');
    });

    it('유효하지 않은 휴대폰 번호 형식', async () => {
      // given
      const signupBody = {
        name: '테스트 사용자',
        email: 'test@example.com',
        phoneNumber: '010123456', // 자릿수 부족
        password: 'Password123',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signupBody);

      // then
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('BAD_REQUEST');
      expect(response.body.message).toBe('올바른 전화번호 형식이 아닙니다.');
    });

    it('유효하지 않은 비밀번호 - 영문자와 숫자 조합 누락', async () => {
      // given
      const signupBody = {
        name: '테스트 사용자',
        email: 'test@example.com',
        phoneNumber: '01012345678',
        password: 'onlytext',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signupBody);

      // then
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('BAD_REQUEST');
      expect(response.body.message).toBe(
        '비밀번호는 영문자와 숫자를 포함해야 합니다.',
      );
    });

    it('유효하지 않은 비밀번호 - 길이 제한', async () => {
      // given
      const signupBody = {
        name: '테스트 사용자',
        email: 'test@example.com',
        phoneNumber: '01012345678',
        password: 'Pw1', // 8자 미만
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signupBody);

      // then
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('BAD_REQUEST');
      expect(response.body.message).toBe(
        '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
      );
    });
  });

  describe('/api/v1/auth/login (POST)', () => {
    it('성공', async () => {
      // given
      const userInfo = {
        name: '로그인 테스트',
        email: 'login@example.com',
        phoneNumber: '01012345678',
        password: 'Password123!',
      };

      // 회원가입 API를 통해 사용자 생성
      await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(userInfo);

      // when - 로그인
      const loginBody = {
        email: userInfo.email,
        password: userInfo.password,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginBody);

      // then
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        code: 'SUCCESS',
        errors: [],
        message: 'Login successful',
        data: {
          accessToken: expect.any(String),
        },
      });
    });

    it('잘못된 비밀번호', async () => {
      // given
      const userInfo = {
        name: '비밀번호 테스트',
        email: 'password@example.com',
        phoneNumber: '01012345678',
        password: 'Password123!',
      };

      // 회원가입 API를 통해 사용자 생성
      await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(userInfo);

      // when - 잘못된 비밀번호로 로그인
      const loginBody = {
        email: userInfo.email,
        password: 'WrongPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginBody);

      // then
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('FORBIDDEN');
    });

    it('존재하지 않는 이메일', async () => {
      // when
      const loginBody = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginBody);

      // then
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('FORBIDDEN');
    });
  });

  describe('/api/v1/auth/me (GET)', () => {
    it('성공', async () => {
      // given
      const userInfo = {
        name: '로그인 테스트',
        email: 'login@example.com',
        phoneNumber: '01012345678',
        password: 'Password123!',
      };

      // 회원가입 API를 통해 사용자 생성
      await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(userInfo);

      // 로그인 API를 통해 토큰 발급
      const loginBody = {
        email: userInfo.email,
        password: userInfo.password,
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginBody);

      const accessToken = loginResponse.body.data.accessToken;
      // const accessToken = 'abc';

      // when
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        code: 'SUCCESS',
        errors: [],
        message: 'Me successful',
        data: {
          id: expect.any(String),
          email: userInfo.email,
          name: userInfo.name,
          phoneNumber: userInfo.phoneNumber,
        },
      });
    });
  });
});
