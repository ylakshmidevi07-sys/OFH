import { useState, useCallback, useMemo } from "react";

export interface UseBulkSelectionOptions<T> {
  items: T[];
  getItemId: (item: T) => string;
}

export interface UseBulkSelectionReturn {
  selectedIds: Set<string>;
  isSelected: (id: string) => boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  toggleItem: (id: string) => void;
  toggleAll: () => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectedCount: number;
  getSelectedItems: <T>(items: T[], getId: (item: T) => string) => T[];
}

export function useBulkSelection<T>({
  items,
  getItemId,
}: UseBulkSelectionOptions<T>): UseBulkSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allIds = useMemo(() => new Set(items.map(getItemId)), [items, getItemId]);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const isAllSelected = useMemo(
    () => allIds.size > 0 && allIds.size === selectedIds.size && [...allIds].every((id) => selectedIds.has(id)),
    [allIds, selectedIds]
  );

  const isIndeterminate = useMemo(
    () => selectedIds.size > 0 && !isAllSelected,
    [selectedIds.size, isAllSelected]
  );

  const toggleItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  }, [isAllSelected, allIds]);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(allIds));
  }, [allIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const getSelectedItems = useCallback(
    <U>(itemList: U[], getId: (item: U) => string): U[] => {
      return itemList.filter((item) => selectedIds.has(getId(item)));
    },
    [selectedIds]
  );

  return {
    selectedIds,
    isSelected,
    isAllSelected,
    isIndeterminate,
    toggleItem,
    toggleAll,
    selectAll,
    clearSelection,
    selectedCount: selectedIds.size,
    getSelectedItems,
  };
}
