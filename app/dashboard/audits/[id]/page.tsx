import AuditDetailClient from './audit-detail-client';

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AuditDetailClient auditId={id} />;
}