import { AppDataSource } from "../config/datasource";
import { Participant } from "../models/participant.model";

class ParticipantService {
  private participantRepo = AppDataSource.getRepository(Participant);

  async createParticipant(
    userId: string,
    sessionId: string,
  ): Promise<Participant> {
    const participant = this.participantRepo.create({
      userId,
      quizSessionId: sessionId,
    });
    return await this.participantRepo.save(participant);
  }

  async getParticipant(participantId: string): Promise<Participant> {
    const participant = await this.participantRepo.findOneBy({
      id: participantId,
    });
    if (!participant) {
      throw new Error("Participant not found");
    }
    return participant;
  }

  async updateParticipantScore(
    participantId: string,
    score: number,
  ): Promise<Participant> {
    const participant = await this.getParticipant(participantId);
    participant.score = score;
    return await this.participantRepo.save(participant);
  }
}

export const participantService = new ParticipantService();
