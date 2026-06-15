import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent, AgentDocument } from '../../../database/entities/agent.entity';

@Injectable()
export class DeleteAgentService {
    constructor(
        @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
    ) {}

    async execute(userId: string, agentId: string) {
        const agent = await this.agentModel.findById(agentId).exec();

        if (!agent) {
            throw new NotFoundException('Agent not found');
        }

        if (agent.userId.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to delete this agent');
        }

        agent.revoke();
        await agent.save();

        return {
            success: true,
            message: 'Agent revoked successfully',
        };
    }
}