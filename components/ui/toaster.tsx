"use client";

import { useToast } from "@/hooks/use-toast";
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/toast";
import { CheckCircle2Icon, InfoIcon, XCircleIcon } from "lucide-react";

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(function ({
				id,
				title,
				description,
				variant,
				action,
				...props
			}) {
				const icon =
					variant === "success" ? (
						<CheckCircle2Icon />
					) : variant === "error" ? (
						<XCircleIcon />
					) : (
						<InfoIcon />
					);

				return (
					<Toast key={id} {...props}>
						<div className="flex gap-2 items-center">
							<span className="text-xl">{icon}</span>
							<div className="grid gap-1">
								{title && <ToastTitle>{title}</ToastTitle>}
								{description && (
									<ToastDescription>{description}</ToastDescription>
								)}
							</div>
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
