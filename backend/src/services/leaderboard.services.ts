import { redisClient } from "../config/redis";

class LeaderboardService {
  private getLeaderboardKey(sessionId: string): string {
    return `api:session:${sessionId}:leaderboard`;
  }

  async ensureMember(sessionId: string, participantId: string): Promise<void> {
    const leaderboardKey = this.getLeaderboardKey(sessionId);
    await redisClient.zadd(leaderboardKey, "NX", 0, participantId);
  }

  async updateScore(
    sessionId: string,
    participantId: string,
    score: number,
  ): Promise<void> {
    const leaderboardKey = this.getLeaderboardKey(sessionId);
    await redisClient.zadd(leaderboardKey, score, participantId);
  }

  async incrementScore(
    sessionId: string,
    participantId: string,
    value: number,
  ): Promise<number> {
    const key = this.getLeaderboardKey(sessionId);
    const updatedScore = await redisClient.zincrby(key, value, participantId);
    return Number(updatedScore);
  }

  async getLeaderboard(sessionId: string, topN: number = 10) {
    const leaderboardKey = this.getLeaderboardKey(sessionId);
    const result = await redisClient.zrevrange(
      leaderboardKey,
      0,
      topN - 1,
      "WITHSCORES",
    );
    return this.formatLeaderboard(result);
  }

  private formatLeaderboard(data: string[]) {
    const leaderboard = [];

    for (let i = 0; i < data.length; i += 2) {
      leaderboard.push({
        participantId: data[i],
        score: Number(data[i + 1]),
      });
    }

    return leaderboard;
  }

  async getUserRank(sessionId: string, participantId: string) {
    const key = this.getLeaderboardKey(sessionId);

    const rank = await redisClient.zrevrank(key, participantId);
    return rank !== null ? rank + 1 : null;
  }

  async getUserScore(
    sessionId: string,
    participantId: string,
  ): Promise<number> {
    const key = this.getLeaderboardKey(sessionId);
    const score = await redisClient.zscore(key, participantId);
    return score ? Number(score) : 0;
  }

  // Clear leaderboard (new session)
  async clear(sessionId: string) {
    const key = this.getLeaderboardKey(sessionId);
    await redisClient.del(key);
  }
}

export const leaderboardService = new LeaderboardService();
