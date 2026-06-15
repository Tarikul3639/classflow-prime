import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Agent, AgentDocument } from '../../../database/entities/agent.entity';
import { UpdateAgentRequestDto } from '../dto/update-agent.dto';

@Injectable()
export class UpdateAgentService {
    constructor(
        @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
    ) {}

    async execute(userId: string, agentId: string, dto: UpdateAgentRequestDto) {
        const agent = await this.agentModel.findById(agentId).exec();

        if (!agent) {
            throw new NotFoundException('Agent not found');
        }

        if (agent.userId.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to update this agent');
        }

        // Update fields if provided
        if (dto.name !== undefined) agent.name = dto.name;
        if (dto.scopes !== undefined) agent.scopes = dto.scopes;
        
        if (dto.allowedClassIds !== undefined) {
            agent.allowedClassIds = dto.allowedClassIds.map((id) => new Types.ObjectId(id));
        }

        if (dto.expiresAt !== undefined) {
            agent.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
        }

        await agent.save();

        return {
            success: true,
            message: 'Agent updated successfully',
            data: {
                agent: {
                    _id: agent._id.toString(),
                    name: agent.name,
                    apiKeyPrefix: agent.apiKeyPrefix,
                    scopes: {
                        create: agent.scopes?.create ?? false,
                        update: agent.scopes?.update ?? false,
                        delete: agent.scopes?.delete ?? false,
                    },
                    allowedClassIds: agent.allowedClassIds.map((id) => id.toString()),
                    status: agent.status,
                    expiresAt: agent.expiresAt ? agent.expiresAt.toISOString() : null,
                },
            },
        };
    }
}