import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { ReactNode } from "react";

type ModalErrorInLoginProps = {
    closeModal: () => void
    error: ReactNode
}

export const ModalErrorInLogin = ({error, closeModal}:ModalErrorInLoginProps) => {
    return(
        <Dialog open={!!error} onOpenChange={closeModal}>
        <DialogContent className="bg-zinc-800 text-zinc-100 border-zinc-600">
          <DialogHeader>
            <DialogTitle className="text-amber-500">Error</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{error}</p>
          </div>
          <DialogFooter>
            <Button
              onClick={closeModal}
              className="bg-amber-600 cursor-pointer text-zinc-900 hover:bg-amber-500"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}