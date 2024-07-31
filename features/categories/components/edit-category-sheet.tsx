import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { insertCategorySchema } from '@/db/schema'
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account'
import { useDeleteCategory } from '@/features/categories/api/use-delete-category'
import { useEditCategory } from '@/features/categories/api/use-edit-category'
import { useGetCategory } from '@/features/categories/api/use-get-category'
import { CategoryForm } from '@/features/categories/components/category-form'
import { useConfirm } from '@/hooks/use-confirm'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

const formSchema = insertCategorySchema.pick({
  name: true,
})

type FormValues = z.infer<typeof formSchema>

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenAccount()
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this category.'
  )

  const accountQuery = useGetCategory(id)
  const editMutation = useEditCategory(id)
  const deleteMutation = useDeleteCategory(id)

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => onClose(),
    })
  }

  const onDelete = async () => {
    const ok = await confirm()

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => onClose(),
      })
    }
  }

  const isPending = editMutation.isPending || deleteMutation.isPending
  const isLoading = accountQuery.isLoading
  const defaultValues = accountQuery.data
    ? { name: accountQuery.data.name }
    : { name: '' }

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
