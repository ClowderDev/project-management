import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import { CreateProjectDialog } from "~/components/project/create-project";
import { InviteMemberDialog } from "~/components/workspace/invite-member";
import { ProjectList } from "~/components/workspace/project-list";
import { WorkspaceHeader } from "~/components/workspace/workspace-header";
import { useGetWorkspaceQuery } from "~/hooks/use-workspace";
import type { Project, Workspace } from "~/types";

interface OutletContext {
  onWorkspaceSelected: (workspace: Workspace) => void;
}

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { onWorkspaceSelected } = useOutletContext<OutletContext>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);

  if (!workspaceId) {
    return <div>No workspace found</div>;
  }

  const { data, isLoading, error } = useGetWorkspaceQuery(workspaceId) as {
    data: {
      workspace: Workspace;
      projects: Project[];
    };
    isLoading: boolean;
    error: any;
  };

  // Automatically set the current workspace when the page loads
  useEffect(() => {
    if (data?.workspace && onWorkspaceSelected) {
      onWorkspaceSelected(data.workspace);
    }
  }, [data?.workspace, onWorkspaceSelected]);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Error loading workspace: {error.message || "Something went wrong"}
      </div>
    );
  }

  if (!data || !data.workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={data.workspace}
        members={data.workspace.members as any}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />

      <ProjectList
        workspaceId={workspaceId}
        projects={data.projects}
        onCreateProject={() => setIsCreateProject(true)}
      />

      <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={data.workspace.members as any}
      />

      <InviteMemberDialog
        isOpen={isInviteMember}
        onOpenChange={setIsInviteMember}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default WorkspaceDetails;
