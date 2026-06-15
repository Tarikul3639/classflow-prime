import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';
import { AgentGuard } from '../../agent/guards/agent.guard';
import { ActorType } from '../interfaces/actor.interface';

@Injectable()
export class HybridAuthGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly agentGuard: AgentGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const apiKey = request.headers['x-api-key'];

    // JWT Authentication
    if (authHeader) {
      const isAllowed = await this.jwtAuthGuard.canActivate(context);
      if (!isAllowed) throw new UnauthorizedException();

      request.actor = {
        type: ActorType.USER,
        userId: request.user.userId,
      };
      return true;
    }

    // Agent Authentication
    if (apiKey) {
      const isAllowed = await this.agentGuard.canActivate(context);
      if (!isAllowed) throw new UnauthorizedException();

      request.actor = {
        type: ActorType.AGENT,
        agentId: request.agent._id.toString(),
        scopes: request.agent.scopes,
        allowedClassIds: request.agent.allowedClassIds.map((id: any) => id.toString()),
      };
      return true;
    }

    throw new UnauthorizedException('Authentication required');
  }
}