import connect from "@/lib/db";
import AdminEvent from "@/lib/models/adminEvent";

type AdminEventInput = {
  type: "login" | "login_failed" | "logout" | "admin_action" | "app_error" | "app_warning";
  actorId?: string | null;
  targetId?: string | null;
  action?: string | null;
  message?: string | null;
  route?: string | null;
  status?: number | null;
};

export async function recordAdminEvent(event: AdminEventInput) {
  try {
    await connect();
    await AdminEvent.create({
      ...event,
      message: event.message?.slice(0, 500) ?? null,
      route: event.route?.slice(0, 200) ?? null,
    });
  } catch {
    // Monitoring must not prevent authentication or a user action from completing.
  }
}
