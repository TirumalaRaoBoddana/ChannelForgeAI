import { ProjectService, DEMO_PROJECTS_DATA } from "@/services/project.service";
import type { FullProjectWithRelations } from "@/types";

export type ProjectWithDetails = FullProjectWithRelations;

export class ProjectRepository {
  static async findMany(options?: {
    userId?: string;
    includeDemos?: boolean;
    includeDetails?: boolean;
  }): Promise<ProjectWithDetails[]> {
    return await ProjectService.getUserProjects(options?.userId);
  }

  static async findById(id: string): Promise<ProjectWithDetails | null> {
    return await ProjectService.getProjectById(id);
  }

  static async create(data: any): Promise<ProjectWithDetails> {
    return await ProjectService.createChannelProject(data);
  }

  static async update(id: string, data: any) {
    return { id, ...data };
  }

  static async delete(id: string) {
    return await ProjectService.deleteProject(id);
  }
}

export { DEMO_PROJECTS_DATA };
