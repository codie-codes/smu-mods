import { Calendar, Download, File, Image } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportDropdownProps {
  disabled: boolean;
  isCurrentTerm: boolean;
  onExportClassesICal: () => void;
  onExportExamsICal: () => void;
  onExportPDF: () => void;
  onExportPNG: () => void;
}

export function ExportDropdown({
  disabled,
  isCurrentTerm,
  onExportClassesICal,
  onExportExamsICal,
  onExportPDF,
  onExportPNG,
}: ExportDropdownProps) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={disabled}>
            <Download className="mr-2" />
            Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isCurrentTerm && (
            <>
              <DropdownMenuItem onClick={onExportClassesICal}>
                <Calendar className="mr-2 size-4" />
                Classes iCal
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={onExportPDF}>
            <File className="mr-2 size-4" />
            PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportPNG}>
            <Image className="mr-2 size-4" />
            PNG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
