import { cloneDeep } from 'lodash'

export default class MinHeap<Key = number | string | Date, Value = any> {
  private arr: InternalMinHeapNode<Key, Value>[] = []
  private count = 0

  private get(index: number): InternalMinHeapNode<Key, Value> {
    return this.arr[index]
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2)
  }

  private getLeftChildIndex(index: number): number {
    return (2 * index) + 1
  }

  private getRightChildIndex(index: number): number {
    return (2 * index) + 2
  }

  private hasLeftChild(index: number): boolean {
    const leftChildIndex = this.getLeftChildIndex(index)

    return this.arr[leftChildIndex] !== undefined
  }

  private hasRightChild(index: number): boolean {
    const rightChildIndex = this.getRightChildIndex(index)

    return this.arr[rightChildIndex] !== undefined
  }

  private swap(index1: number, index2: number) {
    const temp = this.arr[index1]
    this.arr[index1] = this.arr[index2]
    this.arr[index2] = temp
  }

  private moveLastElementToTheFirst(): void {
    const lastIndex = this.arr.length - 1
    this.swap(0, lastIndex)
    this.arr.splice(lastIndex, 1)
  }

  private heapifyUp(index: number): void {
    if (index === 0) { return }

    const parentIndex = this.getParentIndex(index)
    const current = this.get(index)
    const parent = this.get(parentIndex)
    if (current.key < parent.key) {
      this.swap(index, parentIndex)
      this.heapifyUp(parentIndex)
    }
  }

  private getMinChildIndex(index: number): number {
    const leftChildIndex = this.getLeftChildIndex(index)
    const rightChildIndex = this.getRightChildIndex(index)
    const leftChild = this.get(leftChildIndex)
    const rightChild = this.get(rightChildIndex)

    if (this.hasRightChild(index) && this.hasLeftChild(index) && leftChild.key < rightChild.key) {
      return leftChildIndex
    } else if (this.hasRightChild(index) && this.hasLeftChild(index) && rightChild.key < leftChild.key) {
      return rightChildIndex
    } else if (this.hasRightChild(index) && this.hasLeftChild(index) && leftChild.key === rightChild.key && leftChild.insertCount < rightChild.insertCount) {
      return leftChildIndex
    } else if (this.hasRightChild(index) && this.hasLeftChild(index) && leftChild.key === rightChild.key && rightChild.insertCount < leftChild.insertCount) {
      return rightChildIndex
    }

    return leftChildIndex
  }

  private heapifyDown(index: number): void {
    const minChildIndex = this.getMinChildIndex(index)
    const minChild = this.get(minChildIndex)
    const current = this.get(index)

    if (!this.hasLeftChild(index)) return

    if (minChild.key < current.key || (minChild.key === current.key && minChild.insertCount < current.insertCount)) {
      this.swap(index, minChildIndex)
      this.heapifyDown(minChildIndex)
    }
  }

  isEmpty(): boolean {
    return this.arr.length === 0
  }

  size(): number {
    return this.arr.length
  }

  peak(): Nullable<MinHeapNode<Key, Value>> {
    if (!this.arr.length) { return null }

    const { key, value } = this.arr[0]
    return { key, value }
  }

  deleteMin(): Nullable<MinHeapNode<Key, Value>> {
    if (this.size() === 0) { return null }

    const min = this.arr[0]
    this.moveLastElementToTheFirst()
    this.heapifyDown(0)
    return { key: min.key, value: min.value }
  }

  insert({ key, value }: MinHeapNode<Key, Value>): void {
    const node = cloneDeep({ key, value, insertCount: this.count })
    const index = this.arr.push(node)
    this.count = this.count + 1
    this.heapifyUp(index - 1)
  }

  clear(): void {
    this.arr = []
  }

  debug(): {key: Key, value: Value, insertCount: number}[] {
    return this.arr
  }
}

type Nullable<T> = T | null

type MinHeapNode<Key, Value> = {
  key: Key,
  value: Value,
}

type InternalMinHeapNode<Key, Value> = MinHeapNode<Key, Value> & {
  insertCount: number
}
