import { cookies } from 'next/headers';
import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';

import { Chat } from '@/components/chat';
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Add better debugging
  console.log('Session data:', {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  });

  const id = generateUUID();
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  // Extract user data safely with better error handling
  const userData = {
    email: session.user.email || null
  };

  console.log('User data being passed to Chat:', userData);

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedModelId={selectedModelId}
        selectedVisibilityType="private"
        isReadonly={false}
        user={userData}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
