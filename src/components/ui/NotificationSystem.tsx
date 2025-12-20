"use client";

import React from "react";
import { useNotificationStore, Notification } from "@/store/notificationStore";

const Icons = {
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald-600"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  ),
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-red-600"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-500"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-500"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  close: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
};

const Toast = ({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) => {
  return (
    <div
      role="alert"
      className="group pointer-events-auto relative flex w-full max-w-sm items-start gap-4 overflow-hidden rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:shadow-md animate-slide-in-right"
      style={{
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div className="shrink-0 mt-0.5">{Icons[notification.type]}</div>
      <div className="flex-1 w-0">
        {notification.title && (
          <h4 className="mb-1 text-sm font-medium text-foreground leading-none">
            {notification.title}
          </h4>
        )}
        <p className="text-sm text-muted leading-relaxed">
          {notification.message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 ml-4 rounded-md p-1 text-muted hover:text-foreground hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span className="sr-only">Close</span>
        {Icons.close}
      </button>
    </div>
  );
};

const Alert = ({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-4 animate-fade-in">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-1">{Icons[notification.type]}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {notification.title ||
                  notification.type.charAt(0).toUpperCase() +
                    notification.type.slice(1)}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                {notification.message}
              </p>

              <div className="flex items-center justify-end gap-3 mt-4">
                {(notification.onCancel || notification.confirmText) && (
                  <button
                    onClick={() => {
                      if (notification.onCancel) notification.onCancel();
                      onDismiss();
                    }}
                    className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                  >
                    {notification.cancelText || "Cancel"}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (notification.onConfirm) notification.onConfirm();
                    onDismiss();
                  }}
                  className="px-6 py-2 text-sm font-medium text-white bg-foreground rounded-lg hover:bg-foreground/90 transition-all shadow-sm active:scale-95"
                >
                  {notification.confirmText || "Okay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotificationStore();

  const toasts = notifications.filter(
    (n) => n.variant === "toast" || !n.variant
  );
  const alerts = notifications.filter((n) => n.variant === "alert");

  return (
    <>
      {/* Toast Container */}
      <div
        aria-live="assertive"
        className="fixed z-100 flex flex-col gap-3 w-full max-w-sm pointer-events-none right-0 top-0 p-4 sm:p-6"
      >
        {toasts.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onDismiss={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      {/* Alerts Overlay */}
      {alerts.map((notification) => (
        <Alert
          key={notification.id}
          notification={notification}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
};
