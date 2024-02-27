import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {CalendarIcon, Check, Gauge, MapPin, PlusIcon} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import React, {useState} from "react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import styles from "@/components/posting-section/posting-section.module.scss";
import axios from "axios";
import {useFacilities} from "@/hooks/swr/useFacilities";
import {Textarea} from "@/components/ui/textarea";
import validator from "validator";
import {TimeRangePicker} from "@/components/ui/time-picker/time-range-picker";
import {endTimeAtom, startTimeAtom, TimeObject} from "@/atoms/posting-form";
import {AnimateChangeInHeight} from "@/components/shared/AnimateChangeInHeight";
import {useAtom} from "jotai";
import {toast} from "sonner"


const skillLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Professional",
] as const;

// const locationsData = JSON.parse(JSON.stringify(locationsJson));
// let locations: { id: string; name: string }[] = [];
// for (let i = 0; i < locationsData.length; i++) {
//   locations.push({
//     id: locationsData[i],
//     name: locationsData[i],
//   });
// }

const formSchema = z.object({
  hostName: z.string({required_error: "Required field."}),
  contactNumber: z
    .string({required_error: "Required field."})
    .refine(validator.isMobilePhone),
  description: z.string(),
  facilityName: z.string({required_error: "Location has to be selected."}),
  // dateTime: z.date({required_error: "Date has to be selected."}),
  dateTime: z.object({
    start: z.date({required_error: "Date has to be selected."}),
    end: z.date({required_error: "Date has to be selected."}),
  }),
  skillLevel: z.string({required_error: "Skill level has to be selected."}),
});

export default function PostGameModal() {
  const {facilities, isError, isLoading} = useFacilities();
  const [startTime, setStartTime] = useAtom(startTimeAtom)
  const [endTime, setEndTime] = useAtom(endTimeAtom)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hostName: "",
      contactNumber: "",
      description: "",
      facilityName: undefined,
      dateTime: {
        start: undefined,
        end: undefined,
      },
      skillLevel: undefined,
    },
  });
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const packet = {
      hostName: data.hostName,
      contactNumber: data.contactNumber,
      description: data.description,
      facilityName: data.facilityName,
      dateTime: {
        start: format(data.dateTime.start, "yyyy-MM-dd'T'HH:mm:ssXX"),
        end: format(data.dateTime.end, "yyyy-MM-dd'T'HH:mm:ssXX")
      },
      skillLevel: data.skillLevel,
    };
    const res = await axios.post("/api/game", packet).then((res) => res.data);
    if (res.ok) {
      setStartTime({hour: "", minute: "", period: ""})
      setEndTime({hour: "", minute: "", period: ""})
      setOpen(false)
      toast.success("Game posted successfully!", {
        description: "Your game has been posted successfully. You can view it on the home page.",
      })
      form.reset({
        hostName: "",
        contactNumber: "",
        description: "",
        facilityName: undefined,
        dateTime: {
          start: undefined,
          end: undefined,
        },
        skillLevel: undefined,
      });
    } else {
      toast.error("Error", {
        description: "An error occurred while posting your game. Please try again.",
      })
    }
  }

  function genDateTime(date: Date, time: TimeObject) {
    if (!date && !time) return undefined;
    let output = undefined;
    let h = 0
    let m = 0
    if (time.hour && time.minute && time.period) {
      if (time.period === "PM" && parseInt(time.hour) < 12) {
        h = parseInt(time.hour) + 12
      } else {
        h = parseInt(time.hour)
      }
      m = parseInt(time.minute)
    }
    output = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      h,
      m,
      0,
      0
    )
    // check for invalid date
    if (isNaN(output.getTime())) {
      output = undefined
    }
    return output
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={styles.postButton}>
          <PlusIcon size={24}/>
          Post a game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Post a game session</DialogTitle>
          <DialogDescription>
            Post a game and invite other players to join you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="hostName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Your name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jack" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Contact number</FormLabel>
                    <FormControl>
                      <Input placeholder="+65 98765432" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Friendly match.." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormLabel>Details</FormLabel>

              <FormField
                name="facilityName"
                control={form.control}
                render={({field}) => {
                  return (
                    <FormItem className="flex flex-col w-auto h-max">
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                field.value || "text-muted-foreground"
                              )}
                            >
                              <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50"/>
                              {field.value || "Select a facility"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          {/*<FacilityInput field={field}/>*/}
                          <Command>
                            <CommandInput placeholder="Search locations..."/>
                            <CommandEmpty>No locations found.</CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-y-scroll dark:[color-scheme:dark]">
                              {facilities.map((facility: any) => {
                                return (
                                  <CommandItem
                                    value={facility.name}
                                    key={facility.id}
                                    onSelect={(curr) => {
                                      if (facility.name === curr) {
                                        field.onChange("");
                                      }
                                      field.onChange(facility.name);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === facility.name
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {facility.name}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage/>
                    </FormItem>
                  );
                }}
              />

              <FormField
                name="dateTime"
                control={form.control}
                render={({field}) => {
                  console.log("field", field.value)
                  console.log('start', field.value?.start !== undefined)
                  return (
                    <FormItem className="flex flex-col">
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "font-normal",
                                field.value.start || "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-50"/>
                              {field.value?.start && field.value?.end
                                ? (format(field.value.start, "PPP, hh:mm aa") + " - " + format(field.value.end, "hh:mm aa")) :
                                "Select a date"
                              }
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <AnimateChangeInHeight>
                            <Calendar
                              initialFocus
                              mode="single"
                              // @ts-ignore
                              selected={field.value.start}
                              onSelect={(date) => {
                                // take the time from the previous date
                                let startTime = {}
                                if (field.value.start) {
                                }
                                field.onChange({
                                  start: date,
                                  end: date,
                                })
                              }}
                              disabled={(date) => {
                                // today onwards
                                let d = new Date();
                                d.setDate(d.getDate() - 1);
                                return date < d;
                              }}
                            />
                            {field.value.start && (
                              <TimeRangePicker
                                onSelect={(val: { startTime: any; endTime: any }) => {
                                  const startHour = val.startTime.period === "PM" ? (parseInt(val.startTime.hour) + 12).toString() : val.startTime.hour
                                  const endHour = val.endTime.period === "PM" ? (parseInt(val.endTime.hour) + 12).toString() : val.endTime.hour
                                  // check if there is date selected, if so update the time to the selected date
                                  if (field.value?.start && field.value?.end) {
                                    field.onChange({
                                      start: genDateTime(field.value.start, val.startTime),
                                      end: genDateTime(field.value.end, val.endTime),
                                    })
                                    // if there is no date selected, update the time to today
                                    // note that UI does not allow time selection without a selected date
                                  }
                                }}
                              />
                            )}
                          </AnimateChangeInHeight>
                        </PopoverContent>
                      </Popover>
                      <FormMessage/>
                    </FormItem>
                  )
                }}
              />

              <FormField
                name="skillLevel"
                control={form.control}
                render={({field}) => (
                  <FormItem className="flex flex-col w-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "font-normal",
                            field.value || "text-muted-foreground"
                          )}
                        >
                          <Gauge className="mr-2 h-4 w-4"/>
                          {field.value ? field.value : "Select a skill level"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="text-gray-400 w-48">
                        <DropdownMenuGroup>
                          {skillLevels.map((el) => {
                            return (
                              <DropdownMenuCheckboxItem
                                key={el}
                                className={cn(
                                  field.value === el && "text-primary"
                                )}
                                checked={field.value === el}
                                onSelect={() => {
                                  if (field.value === el) {
                                    field.onChange("");
                                  }
                                  field.onChange(el);
                                }}
                                // onCheckedChange={checked => {
                                //   console.log(checked)
                                //   return checked ?
                                //     field.onChange(undefined) :
                                //     field.onChange(el)
                                // }}
                              >
                                {el}
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Post game</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
