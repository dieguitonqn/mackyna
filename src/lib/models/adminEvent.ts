import { Schema, model, models } from "mongoose";

const AdminEventSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["login", "login_failed", "logout", "admin_action", "app_error", "app_warning"],
      required: true,
      index: true,
    },
    actorId: { type: String, default: null, index: true },
    targetId: { type: String, default: null },
    action: { type: String, default: null },
    message: { type: String, default: null, maxlength: 500 },
    route: { type: String, default: null, maxlength: 200 },
    status: { type: Number, default: null },
  },
  { timestamps: true }
);
AdminEventSchema.index({ createdAt: -1 });

const AdminEvent = models.AdminEvent || model("AdminEvent", AdminEventSchema);

export default AdminEvent;
