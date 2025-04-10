"use client";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

type DragItem = {
  index: number;
  type: string;
};

type Props = {
  type: string;
  index: number;
  onMove?: (dragIndex: number, hoverIndex: number) => void;
};

export const useDraggableList = ({ type, index, onMove }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [collectedDropProps, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | null }
  >({
    accept: type,
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      // Prevent replacing items with themselves
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Perform the move
      onMove && onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return {
    ref,
    isDragging,
    collectedDropProps,
  };
};
