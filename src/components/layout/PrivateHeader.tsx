import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Setting from './Setting';
import {auth} from '@/auth';
import { th } from "date-fns/locale";

export default async function PrivateHeader() {
  const session = await auth();
  if(!session?.user?.email) throw new Error('不正なリクエストです。'); 

  return (
    <header className="border-b bg-blue-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/dashboard" passHref>
                <NavigationMenuLink className="font-bold text-xl">
                  管理ページ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Setting session={session} />
      </div>

    </header>
  )
}
