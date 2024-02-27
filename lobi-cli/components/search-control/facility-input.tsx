import {useFacilities} from "@/hooks/swr/useFacilities";
import {useEffect} from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator
} from "@/components/ui/command";
import {Check} from "lucide-react";
import {cn} from "@/lib/utils";
import * as React from "react";

type Props = {
  field: {
    value: any,
    onChange: (value: any) => void
  }
}

export function FacilityInput(props: Props) {
  const {facilities, isError, isLoading} = useFacilities()

  if (isLoading) return <div>loading...</div>
  if (isError) return <div>error</div>

  return (<Command>
      <CommandInput placeholder="Search facilities..."/>
      <CommandEmpty>No locations found.</CommandEmpty>
      <CommandGroup className="max-h-[300px] overflow-y-scroll dark:[color-scheme:dark]">
        <CommandItem
          key="select-all"
          onSelect={() => {
            if (props.field.value === null || props.field.value?.length > 0) {
              props.field.onChange([])
            } else {
              props.field.onChange(null)
            }
          }}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              props.field.value?.length === 0
                ? "opacity-100"
                : "opacity-0"
            )}
          />
          Select all
        </CommandItem>
        <CommandSeparator/>
        {
          facilities.map((facility: any) => {
              return <CommandItem
                value={facility.name}
                key={facility.id}
                onSelect={val => {
                  const index = props.field.value?.findIndex((el: any) => el.id === facility.id)
                  console.log(index)
                  if (index > -1) { // found
                    props.field.onChange(props.field.value?.filter((el: any) => el.id != facility.id))
                    if (props.field.value?.length === 0) {
                      props.field.onChange(null)
                    }
                  } else {
                    props.field.onChange([...props.field?.value || [], {id: facility.id, name: facility.name}])
                  }
                }
                }
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    props.field.value?.length === 0
                      ? "opacity-100"
                      :
                      props.field.value?.some((el: any) => el.id == facility.id)
                        ? "opacity-100"
                        : "opacity-0"
                  )}
                />
                {facility.name}
              </CommandItem>
            }
          )}
      </CommandGroup>
    </Command>
  )
}