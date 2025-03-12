import { UserRepository } from '@core/auth/repository/user.repository';
import { OrdererId } from '@core/outbound/domain/object/orderer.domain';
import { Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@support/exception/service-exception';

@Injectable()
export class OutboundBundleOrdererReader {
  constructor(private readonly userRepository: UserRepository) {}

  async read(ordererId: OrdererId) {
    const user = await this.userRepository.findById(ordererId);

    if (!user) {
      throw EntityNotFoundException(
        `orderer를 찾을 수 없습니다. id: ${ordererId.value}`,
      );
    }

    return user.toOrderer();
  }
}
