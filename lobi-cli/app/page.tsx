import SearchControlZod from "@/components/search-control/search-control-zod";
import GameBoard from "@/components/game-board/game-board";
import PostingSection from "@/components/posting-section/posting-section";
import {Banner} from "@/components/banner/banner";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 px-24">
      <Banner/>
      <SearchControlZod />
      <PostingSection/>
      <GameBoard />
    </main>
  )
}
