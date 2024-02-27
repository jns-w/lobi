import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationUi
} from "@/components/ui/pagination-ui";
import React from "react";

type PaginationProps = {
  page: number;
  pageCount: number;
  goToPage: (page: number) => void;
}

export default function Pagination(props: PaginationProps) {

  function generatePageNumbers(page: number, pageCount: number, range: number): any {
    const items = []
    let i = 1;

  }

  function generateBefore(page: number, pageCount: number, range: number): any {
    const items = []
    let i = 1
    while (i <= range) {
      const n = page - i
      if (n <= 0) break;
      items.push(
        <PaginationItem>
          <PaginationLink
            href=""
            onClick={(ev) => {
              ev.preventDefault()
              props.goToPage(n)
            }}
          >
            {n}
          </PaginationLink>
        </PaginationItem>
      )
      i++
    }
    const n = page - i
    if (n >= 1) {
      if (n !== 1) {
        items.pop()
        items.push(
          <PaginationItem>
            <PaginationEllipsis/>
          </PaginationItem>
        )
      }
      items.push(
        <PaginationItem>
          <PaginationLink
            href=""
            onClick={(ev) => {
              ev.preventDefault()
              props.goToPage(1)
            }}
          >
            {1}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return items.reverse()
  }

  function generateAfter(page: number, pageCount: number, range: number): any {
    const items = []
    let i = 1;
    while (i <= range) {
      if (page + i > pageCount) break;
      const n = page + i
      items.push(
        <PaginationItem>
          <PaginationLink
            href=""
            onClick={(ev) => {
              ev.preventDefault()
              props.goToPage(n)
            }}
          >
            {n}
          </PaginationLink>
        </PaginationItem>
      )
      i++
    }
    // handle pages beyond range
    const n = page + i

    if (n <= pageCount) {
      if (n !== pageCount) {
        items.pop()
        items.push(
          <PaginationItem>
            <PaginationEllipsis/>
          </PaginationItem>
        )
      }
      items.push(
        <PaginationItem>
          <PaginationLink
            href=""
            onClick={(ev) => {
              ev.preventDefault()
              props.goToPage(pageCount)
            }}
          >
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return items
  }

  return (
    <PaginationUi>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="" onClick={(ev) => {
            ev.preventDefault()
            const prev = Math.max(props.page - 1, 1)
            props.goToPage(prev)
          }}/>
        </PaginationItem>
        {props.page > 1 && generateBefore(props.page, props.pageCount, 3)}
        <PaginationItem>
          <PaginationLink
            href=""
            isActive
            onClick={(ev) => {
              ev.preventDefault()
            }}
          >
            {props.page}
          </PaginationLink>
        </PaginationItem>
        {props.pageCount > props.page && generateAfter(props.page, props.pageCount, 3)}
        <PaginationItem>
          {props.pageCount >= props.page + 1 ? (
            <PaginationNext href="" onClick={(ev) => {
              ev.preventDefault()
              props.goToPage(props.page + 1)
            }}/>
          ) : (
            <PaginationNext
              href=""
              className="ghost"
              onClick={(ev) => {
                ev.preventDefault()
              }}
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </PaginationUi>
  )
}