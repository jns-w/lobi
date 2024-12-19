"use client";
import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import * as z from "zod";
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {CalendarIcon, Gauge, MapPin, Search} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import appStyles from "../../app/app.module.scss";
import styles from "./search-control.module.scss";
import {motion} from "framer-motion";
import {Separator} from "@/components/ui/separator";
import {addDays, format} from "date-fns";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {fetcher} from "@/lib/api";
import {useAtom} from "jotai";
import {gameBoardAtom, goToPageAtom, pageAtom, pageCountAtom, resultOfAtom,} from "@/atoms/game-board-atom";
import {FacilityInput} from "@/components/search-control/facility-input";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useFacilities} from "@/hooks/swr/useFacilities";
import {useEventListener} from "usehooks-ts";

const skillLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Professional",
] as const;

const FormSchema = z.object({
  dates: z.array(z.date()).nullish(),
  facilities: z.array(z.object({id: z.string(), name: z.string()})).nullish(),
  skillLevels: z.array(z.string()).nullish(),
});

type SearchControlProps = {
  getGames?: Function;
};

const API_ENDPOINT = process.env.API_ENDPOINT || "";


export default function SearchControlZod(props: SearchControlProps) {
  const [gameBoard, setGameBoard] = useAtom(gameBoardAtom);
  const [resultOf, setResultOf] = useAtom(resultOfAtom);
  const {facilities, isError, isLoading} = useFacilities()

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function collectSearchParams(page?: number) {
    const facilities = form.getValues("facilities")?.map((el) => el.id);
    const dates = form
      .getValues("dates")
      ?.map((el) => format(el, "yyyy-MM-dd"));
    const skillLevels = form.getValues("skillLevels");

    let output: {
      facilities?: string[],
      dates?: string[],
      skillLevels?: string[],
      page?: number
    } = {}

    if (facilities && facilities.length > 0) output.facilities = facilities
    if (dates && dates.length > 0) output.dates = dates
    if (skillLevels && skillLevels.length > 0) output.skillLevels = skillLevels
    if (page) output.page = page
    return output;
  }

  function convertToQueryParams(searchParams: any) {
    const params = new URLSearchParams(searchParams);
    router.replace(pathname + "?" + params.toString(), {scroll: false})
  }

  const [page,] = useAtom(pageAtom)
  const [pageCount,] = useAtom(pageCountAtom)
  const [goToPage, setGoToPage] = useAtom(goToPageAtom)

  useEffect(() => {
    if (!goToPage || !page || !pageCount) return
    if (goToPage !== page && goToPage > 0 && goToPage <= pageCount) {
      findGames(goToPage)
    }
  }, [goToPage])

  useEffect(() => {
    // set search queries to form, if any
    const facilitiesParams = searchParams.get("facilities")?.split(",")
    const datesParams = searchParams.get("dates")?.split(",")
    const skillLevelsParams = searchParams.get("skillLevels")?.split(",")
    const page = parseInt(searchParams.get("page") || "1")

    if (isLoading || isError) {
      return
    }

    let doFindGames = false

    if (facilitiesParams) {
      if (facilitiesParams.length === 0) {
        form.setValue("facilities", [])
      }
      form.setValue("facilities", facilitiesParams.map((el) => {
        const facility = facilities.find((f: { name: string, id: string }) => f.id === el)
        return {
          id: el,
          name: facility?.name || ""
        }
      }))
      doFindGames = true
    }
    if (datesParams && datesParams.length > 0) {
      form.setValue("dates", datesParams.map((el) => new Date(el)))
      doFindGames = true
    }
    if (skillLevelsParams && skillLevelsParams.length > 0) {
      form.setValue("skillLevels", skillLevelsParams)
      doFindGames = true
    }

    if (doFindGames) {
      findGames(page)
    }
  }, [facilities])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      facilities: [],
      dates: [],
      skillLevels: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log("submitting...");
    // console.log(data);
  }

  const findGames = useCallback(async (page: number) => {
    const facilityIds = form.getValues("facilities")?.map((el) => el.id);
    const dates = form
      .getValues("dates")
      ?.map((el) => format(el, "yyyy-MM-dd"));
    console.log("f", form.getValues("facilities"));
    const data = await fetcher(`${API_ENDPOINT}/api/game/search`, {
      headers: {
        pagination: true,
        page: page ? page : 1,
        limit: 6,
      },
      query: {
        date: dates,
        facilityId: facilityIds,
        skillLevel: form.getValues("skillLevels"),
      },
    });
    console.log("search", data)
    if (data) {
      setGameBoard({
        items: data.items,
        itemsCount: data.itemsCount,
        limit: data.limit,
        page: data.page,
        pageCount: data.pageCount,
        resultOf: "searched",
        timestamp: new Date(),
      })
    }
    convertToQueryParams(collectSearchParams(page))
  }, [])

  // handle floating search bar
  const [isFloating, setIsFloating] = useState(false);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);

  const markerRef = useRef<HTMLDivElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchWrapperRef.current) {
      // get height of search wrapper
      const searchWrapperHeight = searchWrapperRef.current.offsetHeight;
      // set height of placeholder
      setPlaceholderHeight(searchWrapperHeight)
    }
  }, [isFloating])

  useEventListener('scroll', (ev) => {
    if (markerRef.current) {
      const marker = markerRef.current.getBoundingClientRect()
      if (marker.top < -100) {
        setIsFloating(true)
      } else {
        setIsFloating(false)
      }
    }
  })

  return (
    <>
      <div ref={markerRef}/>
      {isFloating && (
        <div style={{height: placeholderHeight}}/>
      )}
      <motion.div
        layout
        className={cn(styles.searchWrapper, isFloating ? styles.float : "", "flex flex-col gap-5")}
        key="search-wrapper"
        ref={searchWrapperRef}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 200,
          delay: 0.1,
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div
              className={cn(
                appStyles.shadow,
                styles.searchbar,
                "dark:bg-gray-900 dark:shadow-none dark:border-amber-200 dark:border dark:border-opacity-10"
              )}
            >
              <div>
                <FormField
                  name="dates"
                  control={form.control}
                  render={({field}) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value?.length && "text-muted-foreground"
                              )}
                            >
                              {field.value?.length ? (
                                field.value.length === 1 ? (
                                  format(field.value[0], "LLL dd, y")
                                ) : (
                                  <>{field.value.length} dates selected</>
                                )
                              ) : (
                                <span>Date</span>
                              )}
                              <CalendarIcon className="ml-2 h-4 w-4 opacity-50"/>
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <Select
                            onValueChange={(value) => {
                              let d = new Date();
                              let arr = [];
                              for (let i = 0; i < parseInt(value); i++) {
                                arr.push(addDays(d, i));
                              }
                              field.onChange(arr);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Quick options"/>
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="0">Anytime</SelectItem>
                              <SelectItem value="1">Today</SelectItem>
                              <SelectItem value="2">Till Tomorrow</SelectItem>
                              <SelectItem value="3">3 days from now</SelectItem>
                              <SelectItem value="7">A week from now</SelectItem>
                              <SelectItem value="30">A month from now</SelectItem>
                            </SelectContent>
                          </Select>
                          <Calendar
                            initialFocus
                            mode="multiple"
                            // @ts-ignore
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              // today onwards
                              let d = new Date();
                              d.setDate(d.getDate() - 1);
                              return date < d;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>

              <Separator orientation="vertical"/>

              <div>
                <FormField
                  name="facilities"
                  control={form.control}
                  render={({field}) => {
                    return (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="ghost"
                                role="combobox"
                                className={cn(
                                  "justify-between h-12",
                                  field.value?.length === 0 &&
                                  "text-muted-foreground"
                                )}
                              >
                                {field.value === null && "Please select location"}
                                {field.value?.length === 0 && "Any location"}
                                {field.value?.length === 1 &&
                                  `${field.value[0].name}`}
                                {field.value &&
                                  field.value.length > 1 &&
                                  `${field.value?.length} locations selected`}
                                <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <FacilityInput field={field}/>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <Separator orientation="vertical"/>
              <div>
                <FormField
                  name="skillLevels"
                  control={form.control}
                  render={({field}) => (
                    <FormItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "justify-between h-12",
                              field.value?.length === 0 &&
                              "text-muted-foreground"
                            )}
                          >
                            {field.value === null && "Please select skill level"}
                            {field.value?.length === 0 && "Any skill level"}
                            {field.value?.length === 1 &&
                              `${field.value[0]}`}
                            {field.value &&
                              field.value.length > 1 &&
                              `${field.value?.length} skills selected`
                            }
                            <Gauge className="ml-2 h-4 w-4"/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="text-gray-400 w-48">
                          <DropdownMenuCheckboxItem
                            key="select-all"
                            className="text-primary"
                            checked={field.value?.length === 0}
                            onSelect={(ev) => {
                              ev.preventDefault();
                            }}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([])
                                : field.onChange(null);
                            }}
                          >
                            Select all
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuSeparator/>
                          <DropdownMenuGroup>
                            {skillLevels.map((el) => {
                              return (
                                <DropdownMenuCheckboxItem
                                  key={el}
                                  className="text-primary"
                                  checked={field.value?.length === 0 || field.value?.includes(el)}
                                  onSelect={(ev) => ev.preventDefault()}
                                  onCheckedChange={(checked) => {
                                    if (field.value?.length === 0 || field.value === null) {
                                      field.onChange([el]);
                                    } else {
                                      return checked
                                        ? field.onChange([
                                          ...(field.value || []),
                                          el,
                                        ])
                                        : field.onChange(
                                          field.value?.filter((x) => x !== el)
                                        );
                                    }
                                  }}
                                >
                                  {el}
                                </DropdownMenuCheckboxItem>
                              );
                            })}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className={cn("text-white", appStyles.searchButton)}
                onClick={() => {
                  findGames(1);
                }}
              >
                <Search className="mr-2 h-4 w-4"/>
                Search
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </>
  );
}
