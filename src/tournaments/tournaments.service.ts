import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tournament, Match } from './tournaments.schema';
import { PatotasService } from '../patotas/patotas.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectModel(Tournament.name) private tournamentModel: Model<Tournament>,
    private patotasService: PatotasService,
  ) {}

  async createTournament(
    patotaId: string,
    teams: string[][],
    eventDate?: Date,
    teamNames?: string[],
    title?: string,
  ): Promise<Tournament> {
    if (!teams || teams.length < 2) {
      throw new BadRequestException('At least 2 teams are required');
    }
    const patota = await this.patotasService.getPatotaById(patotaId);
    if (!patota) {
      throw new NotFoundException('Patota not found');
    }

    const matches = this.generateMatches(teams.length);
    const finalTeamNames = teamNames && teamNames.length === teams.length 
      ? teamNames 
      : Array.from({ length: teams.length }, (_, i) => `Time ${i + 1}`);

    const newTournament = new this.tournamentModel({
      patotaId,
      title: title || 'Torneio',
      eventDate: eventDate || new Date(),
      teamNames: finalTeamNames,
      teams,
      matches,
    });

    return newTournament.save();
  }

  private generateMatches(numTeams: number): Match[] {
    const matches: Match[] = [];

    if (numTeams === 2) {
      matches.push({
        matchId: 'final',
        label: 'Final',
        homeTeamIndex: 0,
        awayTeamIndex: 1,
        homeScore: 0,
        awayScore: 0,
        isFinished: false,
      });
    } else if (numTeams === 3) {
      matches.push({ matchId: 'm1', label: 'Jogo 1', homeTeamIndex: 0, awayTeamIndex: 1, homeScore: 0, awayScore: 0, isFinished: false });
      matches.push({ matchId: 'm2', label: 'Jogo 2', homeTeamIndex: 0, awayTeamIndex: 2, homeScore: 0, awayScore: 0, isFinished: false });
      matches.push({ matchId: 'm3', label: 'Jogo 3', homeTeamIndex: 1, awayTeamIndex: 2, homeScore: 0, awayScore: 0, isFinished: false });
    } else if (numTeams === 4) {
      matches.push({ matchId: 's1', label: 'Semifinal 1', homeTeamIndex: 0, awayTeamIndex: 1, homeScore: 0, awayScore: 0, isFinished: false, nextMatchId: 'final', isHomeForNext: true });
      matches.push({ matchId: 's2', label: 'Semifinal 2', homeTeamIndex: 2, awayTeamIndex: 3, homeScore: 0, awayScore: 0, isFinished: false, nextMatchId: 'final', isHomeForNext: false });
      matches.push({ matchId: 'final', label: 'Final', homeTeamIndex: -1, awayTeamIndex: -1, homeScore: 0, awayScore: 0, isFinished: false });
    } else {
      // Para outros números, cria um Round Robin simples
      let matchCounter = 1;
      for (let i = 0; i < numTeams; i++) {
        for (let j = i + 1; j < numTeams; j++) {
          matches.push({
            matchId: `m${matchCounter}`,
            label: `Jogo ${matchCounter}`,
            homeTeamIndex: i,
            awayTeamIndex: j,
            homeScore: 0,
            awayScore: 0,
            isFinished: false,
          });
          matchCounter++;
        }
      }
    }

    return matches;
  }

  async getTournamentsByPatota(patotaId: string): Promise<Tournament[]> {
    return this.tournamentModel
      .find({ patotaId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateMatch(patotaId: string, tournamentId: string, matchId: string, homeScore: number, awayScore: number, isFinished: boolean): Promise<Tournament> {
    const tournament = await this.tournamentModel.findOne({ _id: tournamentId, patotaId });
    if (!tournament) throw new NotFoundException('Tournament not found');

    const matchIndex = tournament.matches.findIndex(m => m.matchId === matchId);
    if (matchIndex === -1) throw new NotFoundException('Match not found');

    tournament.matches[matchIndex].homeScore = homeScore;
    tournament.matches[matchIndex].awayScore = awayScore;
    tournament.matches[matchIndex].isFinished = isFinished;

    // Logic for advancing in bracket
    const currentMatch = tournament.matches[matchIndex];
    if (isFinished && currentMatch.nextMatchId && currentMatch.homeScore !== currentMatch.awayScore) {
      const winnerIndex = currentMatch.homeScore > currentMatch.awayScore ? currentMatch.homeTeamIndex : currentMatch.awayTeamIndex;
      const nextMatchIndex = tournament.matches.findIndex(m => m.matchId === currentMatch.nextMatchId);
      if (nextMatchIndex !== -1) {
        if (currentMatch.isHomeForNext) {
          tournament.matches[nextMatchIndex].homeTeamIndex = winnerIndex;
        } else {
          tournament.matches[nextMatchIndex].awayTeamIndex = winnerIndex;
        }
      }
    }

    // mongoose won't automatically detect deep array changes unless marked
    tournament.markModified('matches');
    return tournament.save();
  }
}
