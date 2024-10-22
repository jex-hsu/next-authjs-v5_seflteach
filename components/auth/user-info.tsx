import { Session } from "next-auth";
import { ReactElement } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";

interface UserInfoProps {
    user?: Session["user"];
    label: string;
}

interface InfoRowProps {
    label: string;
    value?: string | ReactElement;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        {label === "Two Factor Authentication" ? (
            value
        ) : (
            <p className="truncated text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                {value}
            </p>
        )}
    </div>
);

export const UserInfo = ({ user, label }: UserInfoProps) => (
    <Card className="w-[85%] shadow-md">
        <CardHeader>
            <p className="text-2xl font-semibold text-center">{label}</p>
        </CardHeader>
        <CardContent className="space-y-4">
            <InfoRow label="ID" value={user?.id ?? ""} />
            <InfoRow label="Name" value={user?.name ?? ""} />
            <InfoRow label="Email" value={user?.email ?? ""} />
            <InfoRow label="Role" value={user?.role} />
            <InfoRow
                label="Two Factor Authentication"
                value={
                    <Badge
                        variant={
                            user?.isTwoFactorEnabled ? "success" : "destructive"
                        }
                    >
                        {user?.isTwoFactorEnabled ? "ON" : "OFF"}
                    </Badge>
                }
            />
        </CardContent>
    </Card>
);
