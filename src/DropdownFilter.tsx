import { Dropdown, IDropdownOption } from "@fluentui/react"
import React from "react"
import { IDropdownFilterProps } from "./types"

export function DropdownFilter(props: IDropdownFilterProps) {
	return (
		<Dropdown
			label={props.label}
			selectedKeys={props.selectedKeys}
			options={props.options}
			multiSelect
			styles={{ dropdown: { width: 300 } }}
			onChange={(
				_event: React.FormEvent<HTMLDivElement>,
				option?: IDropdownOption
			): void => {
				if (option) {
					if (option.selected) {
						props.setSelectedKeys([
							...(props.selectedKeys as any),
							option.key,
						])
					} else
						props.setSelectedKeys(
							(props.selectedKeys as any).filter(
								(key: string | number) => key !== option.key
							)
						)
				}
			}}
		/>
	)
}
