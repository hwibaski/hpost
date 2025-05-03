import { setNestApp } from '@core-api/config/set-nest-app';
import { CoreApiModule } from '@core-api/core-api.module';
import { BundleResponseDto } from '@core-api/outbound/controller/v1/response/bundle-response.dto';
import { PlaceQuickOutboundBundleResponseDto } from '@core-api/outbound/controller/v1/response/place-order-response.dto';
import { OutboundBundleRepository } from '@core/outbound/repository/outbound-bundle.repository';
import { QuickOutboundPackageRepository } from '@core/outbound/repository/quick-outbound.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryStorageModule } from '@storage/memory/memory.module';
import { ApiResponse } from '@support/response/api-response';
import request from 'supertest';

describe('PortalOutboundBundleController (e2e)', () => {
  let app: INestApplication;
  let outboundBundleRepository: OutboundBundleRepository;
  let quickOutboundPackageRepository: QuickOutboundPackageRepository;

  const testRequestBody = {
    packagesToOrder: [
      {
        origin: {
          name: '서울',
          detailAddress: '서울 상세주소',
          phoneNumber: '01012345678',
          roadAddress: '서울 도로명주소',
          jibunAddress: '서울 지번주소',
          postalCode: '12345',
          latitude: 37.5665,
          longitude: 126.978,
        },
        destination: {
          name: '부산',
          detailAddress: '부산 상세주소',
          phoneNumber: '01012345678',
          roadAddress: '부산 도로명주소',
          jibunAddress: '부산 지번주소',
          postalCode: '12345',
          latitude: 35.1665,
          longitude: 129.078,
        },
        item: {
          document: 0,
          smallBox: 0,
          bigBox: 0,
          etc: 'test',
          price: 1000,
          weight: 1000,
        },
        vehicleOption: 'CAR',
        clientRequestComment: 'test',
      },
    ],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreApiModule, MemoryStorageModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setNestApp(app);
    await app.init();

    outboundBundleRepository = moduleFixture.get<OutboundBundleRepository>(
      OutboundBundleRepository,
    );
    quickOutboundPackageRepository =
      moduleFixture.get<QuickOutboundPackageRepository>(
        QuickOutboundPackageRepository,
      );
  });

  afterEach(async () => {
    await outboundBundleRepository.deleteAll();
    await quickOutboundPackageRepository.deleteAll();
  });

  afterAll(async () => {
    await app.close();
  });

  const getAccessToken = async () => {
    await request(app.getHttpServer()).post('/api/v1/auth/signup').send({
      name: '테스트 사용자',
      email: 'test@example.com',
      password: 'Password123',
      phoneNumber: '01012345678',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'Password123' });

    const authToken = loginResponse.body.data.accessToken;

    return authToken;
  };

  describe('/api/v1/outbound-bundles (POST)', () => {
    it('아웃바운드 번들 생성 성공', async () => {
      // given
      const authToken = await getAccessToken();

      // when
      const result = await request(app.getHttpServer())
        .post('/api/v1/outbound-bundles')
        .send(testRequestBody)
        .set('Authorization', `Bearer ${authToken}`);

      // then
      const response =
        result.body as ApiResponse<PlaceQuickOutboundBundleResponseDto>;

      expect(response).toEqual({
        success: true,
        code: 'SUCCESS',
        errors: [],
        message: 'Outbound bundle created successfully',
        data: {
          id: expect.any(String),
        },
      });
      expect(result.statusCode).toBe(201);
    });

    it('패키지 없이 번들 생성 시 실패', async () => {
      // given
      const authToken = await getAccessToken();
      const emptyPackageRequest = {
        packagesToOrder: [],
      };

      // when
      const result = await request(app.getHttpServer())
        .post('/api/v1/outbound-bundles')
        .send(emptyPackageRequest)
        .set('Authorization', `Bearer ${authToken}`);

      // then
      expect(result.statusCode).toBe(422);

      const response = result.body as ApiResponse<any>;
      expect(response.success).toBe(false);
      expect(response.code).toBe('UNPROCESSABLE_ENTITY');
    });

    it('필수 필드 누락 시 실패', async () => {
      // given
      const authToken = await getAccessToken();
      const invalidRequest = {
        packagesToOrder: [
          {
            // origin 필드 누락
            destination: {
              name: '부산',
              detailAddress: '부산 상세주소',
              phoneNumber: '01012345678',
              roadAddress: '부산 도로명주소',
              jibunAddress: '부산 지번주소',
              postalCode: '12345',
              latitude: 35.1665,
              longitude: 129.078,
            },
            item: {
              document: 0,
              smallBox: 0,
              bigBox: 0,
              etc: 'test',
              price: 1000,
              weight: 1000,
            },
            vehicleOption: 'CAR',
          },
        ],
      };

      // when
      const result = await request(app.getHttpServer())
        .post('/api/v1/outbound-bundles')
        .send(invalidRequest)
        .set('Authorization', `Bearer ${authToken}`);

      // then
      expect(result.statusCode).toBe(422);

      const response = result.body as ApiResponse<any>;
      expect(response.success).toBe(false);
      expect(response.code).toBe('UNPROCESSABLE_ENTITY');
    });

    it('잘못된 vehicleOption 값 입력 시 실패', async () => {
      // given
      const authToken = await getAccessToken();
      const invalidRequest = {
        packagesToOrder: [
          {
            ...testRequestBody.packagesToOrder[0],
            vehicleOption: 'INVALID_OPTION', // 잘못된 옵션
          },
        ],
      };

      // when
      const result = await request(app.getHttpServer())
        .post('/api/v1/outbound-bundles')
        .send(invalidRequest)
        .set('Authorization', `Bearer ${authToken}`);

      // then
      const response = result.body as ApiResponse<any>;
      expect(response.success).toBe(false);
      expect(response.code).toBe('BAD_REQUEST');
    });
  });

  describe('/api/portal/v1/outbound-bundles/:id (GET)', () => {
    it('성공', async () => {
      // given
      const authToken = await getAccessToken();
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/outbound-bundles')
        .send(testRequestBody)
        .set('Authorization', `Bearer ${authToken}`);

      const savedOutboundBundle =
        createResponse.body as ApiResponse<PlaceQuickOutboundBundleResponseDto>;

      // when
      const result = await request(app.getHttpServer())
        .get(`/api/v1/outbound-bundles/${savedOutboundBundle.data.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      // then
      const response = result.body as ApiResponse<BundleResponseDto>;

      expect(response).toEqual({
        success: true,
        code: 'SUCCESS',
        errors: [],
        message: 'Outbound bundle found successfully',
        data: {
          id: expect.any(String),
          channel: 'PORTAL',
          number: expect.any(String),
          createdAt: expect.any(String),
          quickOutboundPackages: [
            {
              id: expect.any(String),
              number: expect.any(String),
              origin: {
                name: '서울',
                phoneNumber: '01012345678',
              },
              destination: {
                name: '부산',
                phoneNumber: '01012345678',
              },
            },
          ],
        },
      });
      expect(result.statusCode).toBe(200);
    });

    it('존재하지 않는 아웃바운드 번호', async () => {
      // given
      const authToken = await getAccessToken();

      // when
      const result = await request(app.getHttpServer())
        .get('/api/v1/outbound-bundles/1234567890')
        .set('Authorization', `Bearer ${authToken}`);

      // then
      const response = result.body as ApiResponse<BundleResponseDto>;

      expect(response).toEqual({
        success: false,
        code: 'ENTITY_NOT_FOUND',
        errors: [],
        message: 'bundle을 찾을 수 없습니다. id: 1234567890',
        data: null,
      });
      expect(result.statusCode).toBe(404);
    });
  });

  describe('/api/portal/v1/outbound-bundles (GET)', () => {
    it('성공', async () => {
      // given
      const authToken = await getAccessToken();
      await request(app.getHttpServer())
        .post('/api/v1/outbound-bundles')
        .send(testRequestBody)
        .set('Authorization', `Bearer ${authToken}`);

      // when
      const result = await request(app.getHttpServer())
        .get('/api/v1/outbound-bundles?limit=10&offset=0')
        .set('Authorization', `Bearer ${authToken}`);

      // then
      const response = result.body as ApiResponse<BundleResponseDto[]>;

      expect(response).toEqual({
        success: true,
        code: 'SUCCESS',
        errors: [],
        message: 'Outbound bundle list found successfully',
        data: {
          page: 1,
          result: [
            {
              id: expect.any(String),
              channel: 'PORTAL',
              number: expect.any(String),
              createdAt: expect.any(String),
            },
          ],
          totalCount: 1,
          totalPages: 1,
        },
      });
      expect(result.statusCode).toBe(200);
    });

    it('데이터가 없을 때 빈 배열 반환', async () => {
      // given
      const authToken = await getAccessToken();

      // when
      const result = await request(app.getHttpServer())
        .get('/api/v1/outbound-bundles?limit=10&offset=0')
        .set('Authorization', `Bearer ${authToken}`);

      // then
      const response = result.body as ApiResponse<BundleResponseDto[]>;

      expect(response).toEqual({
        success: true,
        code: 'SUCCESS',
        errors: [],
        message: 'Outbound bundle list found successfully',
        data: {
          page: 1,
          result: [],
          totalCount: 0,
          totalPages: 0,
        },
      });
      expect(result.statusCode).toBe(200);
    });
  });
});
