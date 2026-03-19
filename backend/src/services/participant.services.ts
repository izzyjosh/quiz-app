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
}

export const participantService = new ParticipantService();
