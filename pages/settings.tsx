import React, { useState, useCallback } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useCredentialsCookie } from "@/context/credentials-context"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useToast } from "@/hooks/use-toast"
import { FileKey, RefreshCw, Loader2 } from "lucide-react"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://0.0.0.0:8000' : 'https://ouoai.herokuapp.com'

export default function CredentailsPage() {
  const [isUploading, setIsUploading] = useState(false)
  const { cookieValue, setAndSaveCookieValue } = useCredentialsCookie()
  const [openaiApiKey, setOpenaiApiKey] = useState(cookieValue.openaiApiKey)
  const [pineconeEnvironment, setPineconeEnvironment] = useState(
    cookieValue.pineconeEnvironment
  )
  const [pineconeIndex, setPineconeIndex] = useState(cookieValue.pineconeIndex)
  const [pineconeApiKey, setPineconeApiKey] = useState(
    cookieValue.pineconeApiKey
  )
  const [forumURL, setForumURL] = useState(
    cookieValue.githubPersonalToken
  )
  const [discordAPI, setDiscordAPI] = useState(
    cookieValue.githubPersonalToken
  )

  const { toast } = useToast()


  const handleDiscourse = useCallback(async () => {
    setIsUploading(true)
    try {
      const response = await fetch(`${baseUrl}/refresh`, {
        body: JSON.stringify({
          credentials: cookieValue
        }),
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      })
      console.log("🚀 ~ file: index.tsx:47 ~ handleDiscourse ~ response:", response)
      const result = await response.json()
      if (result.error) {
        toast({
          title: "Something went wrong.",
          description: result.error,
        })
      } else {
        toast({
          title: "Process success.",
        })
      }

      setIsUploading(false)
    } catch (e) {
      toast({
        title: "Something went wrong.",
      })
      setIsUploading(false)
    }
  }, [cookieValue, toast])

  const handleOpenaiApiKeyChange = (e) => {
    setOpenaiApiKey(e.target.value)
  }
  const handlePineconeEnvironmentChange = (e) => {
    setPineconeEnvironment(e.target.value)
  }
  const handlePineconeIndexChange = (e) => {
    setPineconeIndex(e.target.value)
  }
  const handlePineconeApiKeyChange = (e) => {
    setPineconeApiKey(e.target.value)
  }

  const handleDiscordApiKeyChange = (e) => {
    setDiscordAPI(e.target.value)
  }

  const handleForumURLChange = (e) => {
    setForumURL(e.target.value)
  }

  const handleSaveCredentials = () => {
    setAndSaveCookieValue({
      openaiApiKey,
      pineconeEnvironment,
      pineconeIndex,
      pineconeApiKey,
      forumURL,
    })
  }

  return (
    <Layout>
      <Head>
        <title>Credentials</title>
        <meta name="description" content="Add credentials" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container flex justify-items-stretch gap-6 pb-8 pt-6 md:py-10">
        <div className="flex flex-col items-start gap-2 ">

          <div className="min-w-1/5 flex flex-col items-start gap-2">
            <div className="my-2 min-w-full py-4 sm:mb-0">

              <Button
                // TODO: Disable when no credentials
                disabled={
                  isUploading ||
                  !cookieValue.openaiApiKey ||
                  !cookieValue.community
                }
                onClick={handleDiscourse}
                className="mt-2"
              >
                {!isUploading ? (
                  <RefreshCw className="mr-2 h-4 w-4" />
                ) : (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Refresh model
              </Button>
            </div>

            <div>
              You can refresh the model by clicking the button above.
              This will spend tokens from your OpenAI account.
            </div>
          </div>

          <h2 className="mt-10 scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
            Add credentials
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileKey className="mr-2 h-4 w-4" />
                Add Credentials
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Add credentials</DialogTitle>
                <DialogDescription>
                  We will need these credentials in order to making API calls to
                  OpenAI. Your credentials will be saved in browser
                  cookie and expire in 7 days, you data will never be stored
                  anywhere in the server.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="openai-api-key" className="text-right">
                    OpenAI API Key
                  </Label>
                  <Input
                    id="openai-api-key"
                    value={openaiApiKey}
                    placeholder="sk-***************************"
                    className="col-span-3"
                    onChange={handleOpenaiApiKeyChange}
                  />
                </div>

                {/* <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pinecone-api-key" className="text-right">
                    Pinecone API Key
                  </Label>
                  <Input
                    id="pinecone-api-key"
                    value={pineconeApiKey}
                    placeholder="*****-****-****"
                    className="col-span-3"
                    onChange={handlePineconeApiKeyChange}
                  />
                </div> */}

                {/* <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pinecone-environment" className="text-right">
                    Pinecone Environment
                  </Label>
                  <Input
                    id="pinecone-environment"
                    value={pineconeEnvironment}
                    placeholder="us-west1-gcp"
                    className="col-span-3"
                    onChange={handlePineconeEnvironmentChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pinecone-index" className="text-right">
                    Pinecone Index Name
                  </Label>
                  <Input
                    id="pinecone-index"
                    value={pineconeIndex}
                    placeholder="book-gpt"
                    className="col-span-3"
                    onChange={handlePineconeIndexChange}
                  />
                </div> */}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discord-ap" className="text-right">
                    Discord API Key (coming soon)
                  </Label>
                  <Input
                    id="discord-api"
                    value={discordAPI}
                    disabled
                    placeholder="**************"
                    className="col-span-3"
                    onChange={handleDiscordApiKeyChange}
                  />
                </div>

                {/* <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discourse-url" className="text-right">
                    Discourse Forum URL
                  </Label>
                  <Input
                    id="discourse-url"
                    value={forumURL}
                    placeholder="https://meta.discourse.org/"
                    className="col-span-3"
                    onChange={handleForumURLChange}
                  />
                </div> */}
              </div>
              <DialogPrimitive.Close asChild>
                <Button onClick={handleSaveCredentials}>Save changes</Button>
              </DialogPrimitive.Close>
            </DialogContent>
          </Dialog>

          <div>
            <h3 className="mt-10 scroll-m-20 pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
              Why need credentials?
            </h3>
            <p>
              This app use OpenAI API to do completion, embedding, and use
              Pinecone as a vector store to index and search doc. Both of them
              are not free. The code is open source, your credentials will not
              be saved on the server.
            </p>
            <p>
              If you are a developer, ideally you want to host this app yourself
              and pass credentials as environment variable.
            </p>
          </div>

          <div>
            <h3 className="mt-10 scroll-m-20 pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
              How to add credentials?
            </h3>
            <ol className="p-4">
              <li>
                Create an API keys from{" "}
                <Link
                  className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open AI
                </Link>
                <Image
                  className="p-4"
                  src="/screenshot/openai-api-key.png"
                  alt="OpenAI API Key"
                  width={500}
                  height={500}
                />
              </li>
              {/* <li>
                2. Create an API key from{" "}
                <Link
                  className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                  href="https://app.pinecone.io/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Pinecone
                </Link>
                <Image
                  className="p-4"
                  src="/screenshot/pinecone-api-key.png"
                  alt="OpenAI API Key"
                  width={500}
                  height={500}
                />
              </li>
              <li>
                3. Create an index with the following settings:{" "}
                <Image
                  className="p-4"
                  src="/screenshot/pinecone-index.png"
                  alt="Create a new index in Pinecone"
                  width={500}
                  height={500}
                />
              </li> */}
            </ol>
          </div>
        </div>
      </section>
    </Layout>
  )
}
