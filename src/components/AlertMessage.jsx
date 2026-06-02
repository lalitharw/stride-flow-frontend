import { Alert, Button, CloseButton, Spinner } from "@heroui/react";

export default function AlertMessage() {
    return (
        <>
            <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title>Unable to connect to server</Alert.Title>
                    <Alert.Description>
                        We're experiencing connection issues. Please try the following:
                        <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                            <li>Check your internet connection</li>
                            <li>Refresh the page</li>
                            <li>Clear your browser cache</li>
                        </ul>
                    </Alert.Description>
                    <Button className="mt-2 sm:hidden" size="sm" variant="danger">
                        Retry
                    </Button>
                </Alert.Content>
                <Button className="hidden sm:block" size="sm" variant="danger">
                    Retry
                </Button>
            </Alert>
        </>
    )
}

