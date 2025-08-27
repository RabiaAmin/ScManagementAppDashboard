import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';

function SideBarLink({ menu, icon ,active , setActive}) {
 
  const Icon = icon;
   const isActive = active === menu;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            onClick={() => setActive(menu)}
            className={`flex h-9 items-center justify-center rounded-lg ${
              isActive
                ? "text-primary border border-primary  hover:bg-primary/20"
                : "text-muted-foreground"
            } transition-colors  md:h-8 md:w-8`}
          >
            <Icon className="w-5 h-5" />
            <span className="sr-only">{menu}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          {menu}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default SideBarLink;