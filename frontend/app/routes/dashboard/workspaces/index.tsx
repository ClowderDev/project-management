import { Loader, PlusCircle, Users } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import CreateWorkspace from "~/components/workspace/create-workspace";
import { WorkspaceAvatar } from "~/components/workspace/workspace-avatar";
import { useGetWorkspacesQuery } from "~/hooks/use-workspace";
import type { Workspace } from "~/types";
import { format } from "date-fns";
import { NoDataFound } from "~/components/no-data-found";
import { WorkspaceCard } from "~/components/workspace/workspace-card";

const Workspaces = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const { data: workspacesResponse, isLoading } = useGetWorkspacesQuery() as {
    data: { data: Workspace[] };
    isLoading: boolean;
  };

  const workspaces = workspacesResponse?.data || [];

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>

          <Button onClick={() => setIsCreatingWorkspace(true)}>
            <PlusCircle className="size-4 mr-2" />
            New Workspace
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} />
          ))}

          {workspaces.length === 0 && (
            <NoDataFound
              title="No workspaces found"
              description="Create a new workspace to get started"
              buttonText="Create Workspace"
              buttonAction={() => setIsCreatingWorkspace(true)}
            />
          )}
        </div>
      </div>
      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

export default Workspaces;
