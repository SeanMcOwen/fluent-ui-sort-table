import { Stack } from "@fluentui/react"
import React from "react"
import { DropdownFilter } from "./DropdownFilter"
import { TextFilter } from "./TextFilter"
import { IDropdownFilterProps, ITextFilterProps } from "./types"

interface ITableFilterProps {
	dropdownProps: IDropdownFilterProps[]
	textProps: ITextFilterProps[]
}

export function TableFilter(props: ITableFilterProps) {
	return (
		<Stack horizontal tokens={{ childrenGap: 20 }} horizontalAlign="center">
			{props.dropdownProps.map(
				(entry: IDropdownFilterProps, index: number) => {
					return <DropdownFilter {...entry} key={index} />
				}
			)}
			{props.textProps.map((entry: ITextFilterProps, index: number) => {
				return <TextFilter {...entry} key={index} />
			})}
		</Stack>
	)
}
