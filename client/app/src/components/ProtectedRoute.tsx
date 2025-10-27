"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { connect, ResolveThunks } from "react-redux";

import ApplicationState from "../store";
import { restoreUserSession } from "../store/auth/authActions";

interface StateProps {
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface DispatchProps {
    restoreUserSession: typeof restoreUserSession;
}

type AllProps = StateProps & ResolveThunks<DispatchProps> & { children: React.ReactNode };

function ProtectedRoute({ children, isAuthenticated, isLoading, restoreUserSession }: AllProps) {
    const router = useRouter();

    useEffect(() => {
        restoreUserSession();
    }, [restoreUserSession]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    fontSize: "1.2rem",
                }}
            >
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

const mapStateToProps = (state: ApplicationState): StateProps => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
});

const mapDispatchToProps: DispatchProps = {
    restoreUserSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
