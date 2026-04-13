import React from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sortable Item Wrapper ---
interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export function SortableItem({ id, children, className }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: "relative" as const,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn(className, isDragging && "opacity-50 theme-blue")}>
            <div
                {...attributes}
                {...listeners}
                className="absolute top-4 left-2 cursor-grab text-slate-400 hover:text-slate-600 p-1 rounded z-20"
            >
                <GripVertical className="h-4 w-4" />
            </div>
            <div className="pl-8">
                {children}
            </div>
        </div>
    );
}

// --- Main List Component ---
interface SortableListProps<T extends { id: string }> {
    items: T[];
    onReorder: (newItems: T[]) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
}

export function SortableList<T extends { id: string }>({
    items,
    onReorder,
    renderItem,
    className,
}: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            onReorder(newItems);
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div className={cn("space-y-4", className)}>
                    {items.map((item, index) => (
                        <SortableItem key={item.id} id={item.id}>
                            {renderItem(item, index)}
                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
