"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const shimmer = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  }
};

export function LoadingTicketsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              {/* Event Header Skeleton */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative h-7 w-48 overflow-hidden rounded-md bg-gray-200">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      variants={shimmer}
                      initial="initial"
                      animate="animate"
                    />
                  </div>
                  <div className="relative h-6 w-20 overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      variants={shimmer}
                      initial="initial"
                      animate="animate"
                    />
                  </div>
                </div>
                <div className="relative h-4 w-3/4 overflow-hidden rounded bg-gray-200 mb-4">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    variants={shimmer}
                    initial="initial"
                    animate="animate"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative h-4 w-40 overflow-hidden rounded bg-gray-200">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        variants={shimmer}
                        initial="initial"
                        animate="animate"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tickets List Skeleton */}
              <div className="space-y-4">
                <div className="relative h-5 w-24 overflow-hidden rounded bg-gray-200">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    variants={shimmer}
                    initial="initial"
                    animate="animate"
                  />
                </div>
                <div className="divide-y">
                  {[1, 2].map((ticketIndex) => (
                    <div key={ticketIndex} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 overflow-hidden rounded-lg bg-gray-200">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            variants={shimmer}
                            initial="initial"
                            animate="animate"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="relative h-5 w-40 overflow-hidden rounded bg-gray-200">
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                variants={shimmer}
                                initial="initial"
                                animate="animate"
                              />
                            </div>
                            <div className="relative h-5 w-16 overflow-hidden rounded-full bg-gray-200">
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                variants={shimmer}
                                initial="initial"
                                animate="animate"
                              />
                            </div>
                          </div>
                          <div className="relative h-4 w-3/4 overflow-hidden rounded bg-gray-200">
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                              variants={shimmer}
                              initial="initial"
                              animate="animate"
                            />
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <div className="relative h-8 w-24 overflow-hidden rounded bg-gray-200">
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                              variants={shimmer}
                              initial="initial"
                              animate="animate"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}