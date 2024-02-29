"use client";
import styles from "./game-board.module.scss";
import {Roboto} from "next/font/google";
import {format} from "date-fns";
import {Calendar, ChevronLeft, ChevronRight, Gauge, Loader, UserCircle2,} from "lucide-react";
import {
  gameBoardAtom,
  gamesListAtom,
  goToPageAtom,
  itemsCountAtom,
  limitAtom,
  pageAtom,
  resultOfAtom,
} from "@/atoms/game-board-atom";
import {useAtom} from "jotai";
import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import {fetcher} from "@/lib/api";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import Pagination from "@/components/ui/pagination/pagination";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../ui/tooltip";
import {toast} from "sonner";

const API_ENDPOINT = process.env.API_ENDPOINT || "";

const cardFont = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

type GameBoardProps = {};

export default function GameBoard(props: GameBoardProps) {
  const [gameBoard, setGameBoard] = useAtom(gameBoardAtom);
  const [games, setGames] = useAtom(gamesListAtom);
  const [resultOf, setResultOf] = useAtom(resultOfAtom);
  const [isLoading, setIsLoading] = useState(false);

  const [page] = useAtom(pageAtom);
  const [limit] = useAtom(limitAtom);
  const [itemsCount] = useAtom(itemsCountAtom);
  const [goToPage, setGoToPage] = useAtom(goToPageAtom);

  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    // check page
    if (!games || !page || !limit || !itemsCount) return;
    setPageCount(Math.ceil(itemsCount / limit));
  }, [games]);

  const headerStringMap: { [key: string]: string } = {
    "": "",
    upcoming: "Upcoming games",
    searched: "Search results",
    featured: "Featured games",
  };

  // fetch upcoming games
  useEffect(() => {
    const data = fetcher(`${API_ENDPOINT}/api/game/upcoming`, {
      headers: {
        pagination: true,
        page: 1,
        limit: 9,
      },
    });
    setIsLoading(true);
    setResultOf("");
    data.then(async (res) => {
      setGameBoard({
        items: res.items,
        itemsCount: res.itemsCount,
        page: res.page,
        pageCount: res.pageCount,
        limit: res.limit,
        resultOf: "upcoming",
        timestamp: new Date(),
      });
      setIsLoading(false);
    });
  }, [setGames, setResultOf]);

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <motion.div className={styles.gameBoardHeaderContainer}>
          <div className="flex justify-center items-center">
            <Loader/>
            <h2>Loading...</h2>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className={styles.gameBoardHeaderContainer}
          transition={{
            type: "ease",
            duration: 0.2,
          }}
          initial={{
            opacity: 0,
            x: -30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
        >
          <h2>{headerStringMap[resultOf ? resultOf : ""] || <></>}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setGoToPage((prev) => {
                  return Math.max(prev - 1, 1);
                });
              }}
            >
              <ChevronLeft/>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setGoToPage((prev) => {
                  return Math.min(prev + 1, pageCount);
                });
              }}
            >
              <ChevronRight/>
            </Button>
          </div>
        </motion.div>
      )}
      {games && (
        <motion.div
          className={styles.listContainer}
          transition={{
            type: "spring",
            duration: 0.5,
            stiffness: 120,
            damping: 20,
          }}
          initial={{
            // opacity: 0.5,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.1,
            },
          }}
        >
          {games.map((game: any, i: number) => {
            return <GameCard game={game} key={game.id}/>;
          })}
        </motion.div>
      )}
      {page && (
        <Pagination page={page} pageCount={pageCount} goToPage={setGoToPage}/>
      )}
    </div>
  );
}
type GameProps = {
  game: Game;
};

type Game = {
  hostName: string;
  id: string;
  dateTime: {
    start: string;
    end: string;
  };
  facility: {
    name: string;
  };
  skillLevel: string;
  description: string;
  contactNumber: string;
};

function GameCard(props: GameProps) {
  const {game} = props;
  const [hoveredOnButton, setShowContact] = useState(false);

  const dt = {
    start: new Date(game.dateTime.start),
    end: new Date(game.dateTime.end),
  };

  return (
    <motion.div
      layout
      key={game.id}
      className={styles.gameWrapper}
      initial={{
        opacity: 0.2,
        y: -30,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 30,
      }}
      animate={{
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 20,
          opacity: {
            type: "tween",
            duration: 0.4,
          },
        },
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.75,
        transition: {
          duration: 0.2,
          type: "tween",
        },
      }}
    >
      <div className={styles.gameCardHeaderContainer}>
        <div className={styles.facilityContainer}>
          {/*<MapPin className="mr-2 h-4 w-4 opacity-50"/>*/}
          {game.facility.name}
        </div>
        <div className={cn(styles.dateContainer, cardFont.className)}>
          <Calendar className="mr-2 h-4 w-4 opacity-70"/>
          <h3>
            {format(dt.start, "dd MMM Y, E, hh:mma") +
              " - " +
              format(dt.end, "hh:mma")}
          </h3>
          <div></div>
        </div>
      </div>
      <div className={styles.gameContentContainer}>
        <div className={styles.descriptionContainer}>
          <h4>
            {game.description.charAt(0).toUpperCase() +
              game.description.slice(1)}
          </h4>
        </div>
        <div className={styles.footerContainer}>
          <motion.button
            className={styles.contactButton}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(game.contactNumber).then(() => {
                        toast.success("Host contact copied to clipboard", {
                          description: "Enjoy your game!"
                        })
                      })
                    }}
                  >
                    <UserCircle2 className="mr-3 h-4 w-4 opacity-50"/>
                    {game.hostName} - {game.contactNumber}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to copy number</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.button>
          <div className={styles.skillLevelContainer}>
            <div>
              <Gauge className="mr-3 h-4 w-4 opacity-50"/>
            </div>
            <div>{game.skillLevel}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
