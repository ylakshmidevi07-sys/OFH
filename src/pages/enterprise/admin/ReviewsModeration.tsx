import { useState } from 'react';
import { useAdminReviews, useUpdateReviewStatus } from '../../../hooks/queries/useAdmin';
import { CheckCircle, XCircle, Star } from 'lucide-react';

const REVIEW_STATUSES = ['all', 'approved', 'pending'];

const ReviewsModeration = () => {
  const [params, setParams] = useState<{ page: number; limit: number; status?: string }>({ page: 1, limit: 20 });
  const { data, isLoading } = useAdminReviews(params);
  const updateStatus = useUpdateReviewStatus();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-800">Reviews Moderation</h1>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {REVIEW_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setParams({ page: 1, limit: 20, status: status === 'all' ? undefined : status })}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              (params.status || 'all') === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Rating</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Comment</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-gray-100" /></td></tr>
              ))
            ) : data?.reviews?.length ? (
              data.reviews.map((review: any) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {review.product?.images?.[0] && (
                        <img src={review.product.images[0]} alt="" className="h-8 w-8 rounded object-cover" />
                      )}
                      <span className="font-medium text-sm line-clamp-1">{review.product?.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p>{review.user?.firstName} {review.user?.lastName}</p>
                    <p className="text-muted-foreground">{review.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-sm line-clamp-2">{review.comment || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      review.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {review.verified ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {!review.verified ? (
                        <button
                          onClick={() => updateStatus.mutate({ id: review.id, verified: true })}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50"
                          title="Approve"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus.mutate({ id: review.id, verified: false })}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          title="Reject"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No reviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} reviews)
          </p>
          <div className="flex gap-2">
            <button
              disabled={data.pagination.page <= 1}
              onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >Previous</button>
            <button
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsModeration;

