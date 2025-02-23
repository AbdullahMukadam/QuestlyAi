import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function AlertDialogDemo({ alertDialogOpen, setalertDialogOpen, deletetheInterview, setdeleteInterviewId, deleteStatus }) {

    const InterviewDelete = () => {
        deletetheInterview()
    }
    return (
        <AlertDialog open={alertDialogOpen} onOpenChange={setalertDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        Interview and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setdeleteInterviewId(null)} disabled={deleteStatus}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={InterviewDelete}>{deleteStatus ? "Deleting.." : "Continue"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
