import { IColumn, IDropdownOption } from "@fluentui/react";

export type DropdownData = string | number | boolean

export interface ISFTableProps<Type> {
	columns: IColumn[]
	items: Type[]
	textFilterProps: { label: string; name: string; startingValue: string }[]
	dropdownFilterProps: {
		label: string
		name: string
		options: {
			key: string | number
			text: string
			data: DropdownData
			selected: boolean
		}[]
	}[]
}

export interface IDropdownFilterProps {
	label: string
	selectedKeys: string[] | number[]
	setSelectedKeys: (newFilter: string[] | number[]) => void
	options: IDropdownOption[]
}

export interface ITextFilterProps {
	label: string
	value: string
	updateValue: (newValue: string) => void
}
